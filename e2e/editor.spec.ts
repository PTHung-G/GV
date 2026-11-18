import { expect, test } from '@playwright/test';
import { signInWithDocuments } from './document-fixture';

test.beforeEach(async ({ page }, info) => {
  if (info.title !== 'AI pipeline plans, streams and applies a generated exam' && info.title !== 'the AI panel shows suggestions generated for this exam') {
    await signInWithDocuments(page);
  }
});

const DOC = '/doc/demo-de-giua-ky-toan-9';

test('editor loads the sample exam on an A4 page', async ({ page }) => {
  await page.goto(DOC);
  const surface = page.locator('#doc-surface');
  await expect(surface).toContainText('ĐỀ KIỂM TRA GIỮA HỌC KÌ I');
  await expect(page.getByRole('toolbar')).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Dàn ý và mẫu chèn' })).toBeVisible();
  await expect(page.getByRole('complementary', { name: 'Trợ lý AI' })).toBeVisible();
});

test('typing autosaves into localStorage', async ({ page }) => {
  await page.goto(DOC);
  const surface = page.locator('#doc-surface');
  await expect(surface).toContainText('ĐỀ KIỂM TRA GIỮA HỌC KÌ I');
  await surface.click();
  await page.keyboard.press('Control+End');
  await expect(surface).toBeFocused();
  await page.keyboard.type(' Ghi chú kiểm thử.');
  await expect(surface).toContainText('Ghi chú kiểm thử.');
  // Wait past the 700ms autosave debounce, then confirm storage.
  await expect
    .poll(async () => (await page.evaluate(() => localStorage.getItem(Object.keys(localStorage).find((key) => key.startsWith('sdt.docs.account.')) ?? '')))?.includes('Ghi chú kiểm thử.'), {
      timeout: 5_000,
    })
    .toBe(true);
});

test('toolbar dropdown is not clipped and applies a block format', async ({ page }) => {
  await page.goto(DOC);
  await page.locator('#doc-surface').click();
  await page.keyboard.press('Control+Home');
  await page.getByRole('button', { name: 'Kiểu đoạn', exact: true }).filter({ hasText: 'Văn bản thường' }).click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  expect(box && box.height).toBeGreaterThan(100);
  // Panel must be painted above the page (portalled, not clipped by the toolbar).
  await expect(menu).toBeInViewport();
  await menu.getByText('Tiêu đề cấp 2').click();
  await expect(page.locator('#doc-surface h2')).toHaveCount(1);
});

test('outline lists the questions and templates overwrite the page', async ({ page }) => {
  await page.goto(DOC);
  const outline = page.getByRole('complementary', { name: 'Dàn ý và mẫu chèn' });
  await expect(outline.getByRole('button', { name: /^Câu 1\./ })).toBeVisible();
  await outline.getByRole('button', { name: 'Mẫu đề thi' }).click();
  await outline.getByRole('button', { name: /Đề trắc nghiệm 4 lựa chọn/ }).click();
  await expect(page.locator('#doc-surface')).toContainText('ĐỀ KIỂM TRA TRẮC NGHIỆM');
});

test('option grids, two-column header and page breaks come from the layout engine', async ({ page }) => {
  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const surface = page.locator('#doc-surface');
  await expect.poll(() => surface.evaluate((el) => el.children.length)).toBeGreaterThan(3);

  // Two-column header: exactly two columns sharing the measured template.
  const header = page.evaluate(() => {
    const el = document.querySelector('#doc-surface .doc-header');
    if (!el) return null;
    return {
      cols: getComputedStyle(el).gridTemplateColumns.split(' ').length,
      children: el.querySelectorAll('.doc-header-col').length,
    };
  });

  // Option grid: measured column count written as an inline template.
  const grid = page.evaluate(() => {
    const g = document.querySelector('#doc-surface .doc-grid') as HTMLElement | null;
    if (!g) return null;
    return { cols: Number(g.dataset.columns), template: g.style.gridTemplateColumns };
  });

  // Pagination: a long document must gain spacers, and they must not be saved.
  await surface.evaluate((el) => {
    el.innerHTML = '<h1>T</h1>';
    for (let i = 1; i <= 120; i++) {
      const p = document.createElement('p');
      p.textContent = `Câu ${i}. Nội dung đủ dài để chiếm một dòng trên trang A4.`;
      el.appendChild(p);
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });

  await expect
    .poll(() => surface.evaluate((el) => el.querySelectorAll('[data-page-spacer]').length), {
      timeout: 10_000,
    })
    .toBeGreaterThan(1);

  const saved = await page.evaluate(() => {
    const docs = JSON.parse(localStorage.getItem(Object.keys(localStorage).find((key) => key.startsWith('sdt.docs.account.')) ?? '') ?? '{"documents":[]}').documents;
    return docs.map((d: { content: string }) => d.content).join('');
  });
  expect(saved).not.toContain('data-page-spacer');

  // The sample document ships both, so these are mandatory assertions.
  const h = await header;
  const g = await grid;
  expect(h, 'sample document has a two-column header').not.toBeNull();
  expect(g, 'sample document has an option grid').not.toBeNull();
  expect(h!.children).toBe(2);
  expect(h!.cols).toBe(2);
  expect(g!.cols).toBeGreaterThan(1);
  expect(g!.template).toContain(`repeat(${g!.cols}`);
});

test('clicking a formula opens the MathLive editor and saves the new LaTeX', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    // MathLive font loading is the one failure that silently corrupts formulas.
    if (m.type() === 'error' && /mathlive|fonts/i.test(m.text())) errors.push(m.text());
  });

  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const formula = page.locator('#doc-surface span.doc-math').first();
  await expect(formula).toBeVisible();

  const before = await page.locator('#doc-surface span.doc-math').count();
  const originalTex = await formula.getAttribute('data-latex');

  await formula.click();
  const popover = page.locator('[data-math-popover]');
  await expect(popover).toBeVisible();

  const field = popover.locator('math-field');
  await expect(field).toBeVisible();
  // The field must sit inside its bordered box, not overflow onto the buttons.
  const box = await popover.evaluate((el) => {
    const f = el.querySelector('math-field') as HTMLElement;
    const parent = f.parentElement as HTMLElement;
    const a = f.getBoundingClientRect();
    const b = parent.getBoundingClientRect();
    return { inside: a.top >= b.top - 1 && a.bottom <= b.bottom + 1 };
  });
  expect(box.inside).toBe(true);

  await field.evaluate((el) => {
    const f = el as HTMLElement & { value: string };
    f.value = '\\frac{a+b}{c}';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await popover.getByRole('button', { name: 'Lưu' }).click();
  await expect(popover).toBeHidden();

  // Formula count is preserved and the new LaTeX is what got stored.
  await expect(page.locator('#doc-surface span.doc-math')).toHaveCount(before);
  await expect
    .poll(() => page.locator('#doc-surface span.doc-math').first().getAttribute('data-latex'))
    .toContain('a+b');
  expect(originalTex).not.toContain('a+b');

  await expect.poll(() => page.evaluate(() => {
    const docs = JSON.parse(localStorage.getItem(Object.keys(localStorage).find((key) => key.startsWith('sdt.docs.account.')) ?? '') ?? '{"documents":[]}').documents;
    return docs.map((d: { content: string }) => d.content).join('');
  })).toContain('\\frac{a+b}{c}');

  expect(errors).toEqual([]);
});

test('a long paragraph is split at a word break and no text is lost', async ({ page }) => {
  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const surface = page.locator('#doc-surface');
  await expect.poll(() => surface.evaluate((el) => el.children.length)).toBeGreaterThan(3);

  const word = 'AAAA';
  await surface.evaluate((el, w) => {
    el.innerHTML = '<h1>X</h1>';
    const p = document.createElement('p');
    p.textContent = `Câu 1. ${(w + ' ').repeat(800)}`;
    el.appendChild(p);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, word);

  // Split into head+tail on screen, with a page break between them.
  await expect
    .poll(() => surface.evaluate((el) => el.querySelectorAll('[data-split-part]').length), {
      timeout: 10_000,
    })
    .toBeGreaterThan(1);

  const shape = await surface.evaluate((el) => {
    const head = el.querySelector('[data-split-part="h"]');
    const tail = el.querySelector('[data-split-part="t"]');
    return {
      headEnd: (head?.textContent ?? '').trim().slice(-20),
      tailStart: (tail?.textContent ?? '').trim().slice(0, 20),
      spacers: el.querySelectorAll('[data-page-spacer]').length,
    };
  });
  // The cut falls between words, never inside one.
  expect(shape.headEnd.endsWith('AAAA')).toBe(true);
  expect(shape.tailStart.startsWith('AAAA')).toBe(true);
  expect(shape.spacers).toBeGreaterThan(0);

  const textLength = () =>
    page.evaluate(() =>
      (document.querySelector('#doc-surface')?.textContent ?? '').replace(/\s+/g, ' ').trim().length,
    );

  const before = await textLength();
  expect(before).toBeGreaterThan(4000);

  // The saved document keeps whole paragraphs; markers never leak into storage.
  const saved = await page.evaluate(() => {
    const docs = JSON.parse(localStorage.getItem(Object.keys(localStorage).find((key) => key.startsWith('sdt.docs.account.')) ?? '') ?? '{"documents":[]}').documents;
    return docs.map((d: { content: string }) => d.content).join('');
  });
  expect(saved).not.toContain('data-split-part');
  expect(saved).not.toContain('data-page-spacer');

  // Reload must restore the same text, not a fragment of it.
  await page.reload();
  await expect.poll(textLength, { timeout: 10_000 }).toBe(before);
});

test('the answer key opens in its own tab and leaves the exam clean', async ({ page }) => {
  await page.route('**/api/exam-answer-key', (route) => route.fulfill({ json: {
    codes: [{ code: '', questions: [{ label: 'Câu 1', answer: 'B' }, {
      label: 'Câu 2', answer: '$x=2$', points: '2,0',
      steps: [{ text: 'Giải phương trình được $x=2$', points: '2,0' }],
    }] }],
  } }));
  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const surface = page.locator('#doc-surface');
  await expect.poll(() => surface.evaluate((el) => el.querySelectorAll('.doc-grid').length)).toBeGreaterThan(0);

  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => /Tạo đáp án/.test(b.innerText));
    btn?.click();
  });

  // The key is a sibling document, surfaced as a second tab.
  const tabs = page.locator('nav[aria-label="Các trang của đề"] a');
  await expect(tabs).toHaveCount(2, { timeout: 120_000 });
  await expect(tabs.nth(1)).toContainText('Đáp án');

  // The exam sheet itself must not contain the marking scheme.
  await expect(surface).not.toContainText('HƯỚNG DẪN CHẤM');

  await tabs.nth(1).click();
  const key = page.locator('#doc-surface');
  await expect(key).toContainText('HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM');
  await expect(key).toContainText('A. HƯỚNG DẪN CHUNG');
  await expect(key).toContainText('B. ĐÁP ÁN VÀ THANG ĐIỂM');
});

test('the AI panel shows suggestions generated for this exam', async ({ page }) => {
  await page.route('**/api/suggestions', (route) => route.fulfill({ json: { suggestions: [
    'Bổ sung một câu vận dụng cho đề đang mở',
    'Soát cách trình bày câu hỏi',
    'Kiểm tra thời lượng làm bài',
  ] } }));
  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const list = page.locator('[data-suggestions] button');
  await expect(list).toHaveCount(3);
  // The panel paints the built-in list first and swaps it once the server
  // answers; under a loaded model that can take longer than the default wait.
  await expect(list.first()).not.toHaveText(/gồm 5 câu tự luận/, { timeout: 25_000 });

  const items = await list.allTextContents();
  // Server-generated: three short, non-empty, single-line prompts.
  expect(items.length).toBe(3);
  for (const item of items) {
    expect(item.trim().length).toBeGreaterThan(5);
    expect(item.length).toBeLessThanOrEqual(120);
  }
});

test('printing produces real A4 pages without screen-only chrome', async ({ page }) => {
  await page.goto('/doc/demo-de-giua-ky-toan-9');
  const surface = page.locator('#doc-surface');
  await expect.poll(() => surface.evaluate((el) => el.children.length)).toBeGreaterThan(3);

  // Enough content to need more than one sheet.
  await surface.evaluate((el) => {
    el.innerHTML = '<h1>ĐỀ DÀI</h1>';
    for (let i = 1; i <= 90; i++) {
      const p = document.createElement('p');
      p.textContent = `Câu ${i}. Nội dung đủ dài để chiếm một dòng trên trang giấy A4 khi in ra.`;
      el.appendChild(p);
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect
    .poll(() => surface.evaluate((el) => el.querySelectorAll('[data-page-spacer]').length))
    .toBeGreaterThan(0);

  const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });

  // A4 is 595 x 842 pt; more than one sheet means the flow really paged.
  const pages = pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? [];
  expect(pages.length).toBeGreaterThan(1);

  // Screen-only chrome must be hidden and spacers must not create blank pages.
  // Check the computed effect under print emulation instead of scraping CSS text.
  await page.emulateMedia({ media: 'print' });
  const printed = await page.evaluate(() => {
    const spacer = document.querySelector('[data-page-spacer]');
    const ruler = document.querySelector('.no-print');
    const surface = document.querySelector('#doc-surface') as HTMLElement;
    const cs = getComputedStyle(surface);
    return {
      spacerHidden: !spacer || getComputedStyle(spacer).display === 'none',
      rulerHidden: !ruler || getComputedStyle(ruler).display === 'none',
      sheetPadding: cs.paddingLeft,
    };
  });
  await page.emulateMedia({ media: 'screen' });

  expect(printed.rulerHidden).toBe(true);
  expect(printed.spacerHidden).toBe(true);
  // @page supplies the margins, so the sheet must not add its own on paper.
  expect(printed.sheetPadding).toBe('0px');

});

test('AI pipeline plans, streams and applies a generated exam', async ({ page }) => {
  const prefix = process.env.NEXT_BASE_PATH ?? '';
  const login = await page.request.post(`${prefix}/api/auth/register`, { data: {
    name: 'AI Test Teacher', email: `ai-ui-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`, password: 'TestChat123!',
  } });
  expect(login.ok()).toBeTruthy();
  const { user } = await login.json();
  const now = new Date().toISOString();
  const library = await page.request.put(`${prefix}/api/documents`, { data: {
    ownerId: user.id, revision: 0, documents: [{ id: 'demo-de-giua-ky-toan-9',
      title: 'Đề kiểm tra AI', content: '<p>Câu 1. Đề đang mở.</p>', subject: 'Toán', grade: 9,
      createdAt: now, updatedAt: now }],
  } });
  expect(library.ok()).toBeTruthy();

  // UI contract test: provider quality and credentials must not decide this result.
  await page.route('**/api/chat-exam/plan', (route) => route.fulfill({ json: {
    decision: 'proceed', templatePrompt: 'Soạn 3 câu Toán lớp 8',
    steps: ['Đọc đề đang mở', 'Soạn 3 câu'], clarifications: [],
  } }));
  await page.route('**/api/chat-exam', async (route) => {
    const turn = route.request().postDataJSON();
    const saved = await page.request.patch(`${prefix}/api/conversations/${turn.conversationId}/turns/${turn.turnId}`, { data: {
      status: 'completed', text: 'Đã soạn xong.', payload: { action: 'replace', html: '<p>Bản nháp được lưu</p>' },
    } });
    expect(saved.ok()).toBeTruthy();
    await route.fulfill({
    contentType: 'text/event-stream',
    body: 'event: result\ndata: ' + JSON.stringify({ success: true, action: 'replace',
      reply: 'Đã soạn xong.', exam: { content: '<h1>ĐỀ TOÁN – Lớp 8</h1><p><b>Câu 1.</b> Giải $x^2=4$.</p>' },
    }) + '\n\n',
    });
  });
  await page.route('**/api/chat-exam/verify', (route) => route.fulfill({ json: { issues: [] } }));
  const calls: string[] = [];
  page.on('request', (r) => {
    const path = new URL(r.url()).pathname;
    if (path.startsWith('/api/chat-exam')) calls.push(path);
  });

  await page.goto(DOC);
  const ai = page.getByRole('complementary', { name: 'Trợ lý AI' });
  await ai.getByRole('textbox').last().fill('Tạo đề thi Toán lớp 8 gồm 3 câu');
  await page.getByRole('button', { name: 'Gửi' }).click();

  const apply = ai.getByRole('button', { name: /Thay vào đề|Chèn vào đề/ });
  await expect(apply).toBeVisible({ timeout: 30_000 });

  // The planner runs first, then generation, then the post-check.
  expect(calls).toEqual([
    '/api/chat-exam/plan',
    '/api/chat-exam',
    '/api/chat-exam/verify',
  ]);

  await apply.click();
  const surface = page.locator('#doc-surface');

  // Wording comes from the model, so assert structure rather than exact text.
  await expect(surface).toContainText('Lớp 8', { timeout: 60_000 });
  await expect(surface.locator('h1, h3, p, b').first()).toBeVisible();
  await expect(surface).not.toContainText('Câu 1 của đề Toán lớp 9');

  // Markdown must not leak; LaTeX must be rendered to MathML, not shown raw.
  const text = await surface.innerText();
  expect(text).not.toContain('**');
  expect(text).not.toContain('$');

  const math = await surface.locator('span.doc-math math').count();
  expect(math).toBeGreaterThan(0);
  // Wait for the debounced account-library write before navigating away.
  await expect(page.getByText('Đã lưu vào tài khoản', { exact: true })).toBeVisible();
  // Formula source survives a save/reload round-trip.
  await page.reload();
  await expect(page.locator('#doc-surface span.doc-math math').first()).toBeVisible();
});

test('unknown document id shows a friendly empty state', async ({ page }) => {
  await page.goto('/doc/khong-ton-tai');
  await expect(page.getByText(/Không tìm thấy đề|chưa có trong máy|Không mở được đề/i).first()).toBeVisible();
});
