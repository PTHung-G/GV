import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { query, closePool } from '../../lib/server/db';
import { getConversation, startConversationTurn, patchConversationTurn, claimConversationGeneration } from '../../lib/server/conversations';

test.describe('conversation lifecycle PostgreSQL invariants', () => {
  test.skip(!process.env.DATABASE_URL, 'Requires migrated PostgreSQL');
  const user = randomUUID();
  test.beforeAll(async () => { await query('insert into users(id,email,name) values($1,$2,$3)', [user, `lifecycle-${user}@example.test`, 'Lifecycle test']); });
  test.afterAll(async () => { await query('delete from users where id=$1', [user]); await closePool(); });
  test('simultaneous first access creates one current conversation', async () => {
    const doc = randomUUID();
    const results = await Promise.all(Array.from({length: 8}, () => getConversation(user, doc)));
    expect(new Set(results.map(r => r.conversation.id)).size).toBe(1);
  });
  test('concurrent admission purchases only one generation; cancellation is immutable', async () => {
    const {conversation} = await getConversation(user, randomUUID());
    const turnId = randomUUID();
    await startConversationTurn(user, conversation.id, {turnId, prompt: 'PCA'});
    const claims = await Promise.allSettled(Array.from({length: 8}, () => claimConversationGeneration(user, conversation.id, turnId)));
    expect(claims.filter(r => r.status === 'fulfilled')).toHaveLength(1);
    await patchConversationTurn(user, conversation.id, turnId, {status: 'cancelled', text: 'Stopped'});
    await expect(patchConversationTurn(user, conversation.id, turnId, {status: 'completed', text: 'Late'})).rejects.toThrow();
  });
  test('stale runs recover as interrupted and allow retry; previous sessions remain', async () => {
    const doc = randomUUID();
    const {conversation} = await getConversation(user, doc);
    const turnId = randomUUID();
    await startConversationTurn(user, conversation.id, {turnId, prompt: 'Recover me'});
    await query("update ai_conversations set messages=jsonb_set(messages,'{1,startedAt}',to_jsonb($2::bigint)) where id=$1", [conversation.id, Date.now()-6*60000]);
    const restored = await getConversation(user, doc);
    expect(restored.conversation.messages[1].status).toBe('interrupted');
    await startConversationTurn(user, conversation.id, {turnId: randomUUID(), prompt: 'Retry me'});
    const fresh = await getConversation(user, doc, undefined, true);
    expect(fresh.conversations).toHaveLength(2);
    const old = await getConversation(user, doc, conversation.id);
    expect(old.conversation.messages.at(-1)?.status).toBe('cancelled');
    await expect(startConversationTurn(user, conversation.id, {turnId: randomUUID(), prompt: 'Archived'})).rejects.toThrow('lưu trữ');
  });
});
