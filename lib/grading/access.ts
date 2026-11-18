/**
 * Who is allowed to touch a grading session.
 *
 * Two kinds of caller exist:
 *   * the owning teacher, authenticated by the normal session cookie;
 *   * a paired phone, whose capture session is scoped to exactly one session id.
 *
 * Every grading route goes through here so ownership is decided in one place.
 */
import { releaseSessionGrant } from '@/lib/exam-release/access';
import { currentCapture, currentUser } from '@/lib/server/auth';
import { queryOne } from '@/lib/server/db';
import { HttpError } from '@/lib/server/http';

export type SessionActor = {
  userId: string;
  via: 'user' | 'capture';
};

export async function sessionOwner(sessionId: string): Promise<string | null> {
  const row = await queryOne<{ owner_id: string }>(
    `select owner_id from grading_sessions where id = $1`,
    [sessionId],
  );
  return row?.owner_id ?? null;
}

/**
 * Resolves the caller for a session, or throws 401/404.
 *
 * A capture session may only reach the one session it was paired with, so a
 * phone cannot enumerate other classes by changing an id.
 */
export async function authorizeSession(sessionId: string): Promise<SessionActor> {
  const releaseGrant = await releaseSessionGrant(sessionId);
  if (releaseGrant) return releaseGrant;
  const capture = await currentCapture();
  if (capture) {
    if (capture.sessionId !== sessionId) {
      throw new HttpError(403, 'Thiết bị này không được ghép với đợt chấm đó.', 'capture_scope_denied');
    }
    return { userId: capture.userId, via: 'capture' };
  }

  const user = await currentUser();
  if (!user) throw new HttpError(401, 'Bạn cần đăng nhập để tiếp tục.', 'unauthenticated');

  const owner = await sessionOwner(sessionId);
  if (!owner || owner !== user.id) {
    throw new HttpError(404, 'Không tìm thấy đợt chấm.', 'session_not_found');
  }
  return { userId: user.id, via: 'user' };
}

/** Same as `authorizeSession` but refuses paired phones. */
export async function authorizeTeacher(sessionId: string): Promise<SessionActor> {
  const actor = await authorizeSession(sessionId);
  if (actor.via !== 'user') {
    throw new HttpError(403, 'Thao tác này cần đăng nhập trên máy tính.', 'teacher_only');
  }
  return actor;
}
