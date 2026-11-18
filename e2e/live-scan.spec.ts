/**
 * End-to-end test for the live scanner.
 *
 * The camera is faked in the page with a canvas stream, so no hardware and no
 * video file are needed, and the sheet is drawn from the very template the app
 * serves to phones. What this proves is the loop the teacher actually feels:
 * point at a sheet, and it is read, uploaded and filed without a single tap —
 * and the same sheet is not filed twice while it stays in view.
 */
import { expect, test, type Page } from '@playwright/test';
import { seedAccountDocuments } from './document-fixture';

const MM = 96 / 25.4;
const ANCHOR_HALF = (10 * MM) / 2;

const RUBRIC = {
  version: 1 as const,
  totalPoints: 10,
  questions: [
    { no: 1, type: 'mc' as const, points: 5, answer: 'A' },
    { no: 2, type: 'mc' as const, points: 5, answer: 'B' },
  ],
};

const PICKS: Record<number, string> = { 1: 'A', 2: 'B' };
const SBD = '000003';
const STUDENT = { code: SBD, name: 'Lê Hoàng Cường' };

async function signIn(page: Page) {
  const email = `e2e-${crypto.randomUUID()}@example.test`;
  const registration = await page.request.post('/api/auth/register', { data: {
    name: 'Test Teacher', email, password: 'TestFixture123!',
  } });
  expect(registration.ok(), await registration.text()).toBe(true);
  expect((await page.request.post('/api/auth/logout')).ok()).toBe(true);
  await page.goto('/');
  await page.getByRole('button', { name: /Đăng nhập/ }).first().click();
  await page.locator('#auth-email').fill(email);
  await page.locator('#auth-password').fill('TestFixture123!');
  await page.getByRole('dialog').getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await page.waitForURL(/\/hub$/, { timeout: 15_000 });
  await seedAccountDocuments(page);
}

test('a printed sheet is scanned and filed without touching the screen', async ({ page, browser }) => {
  await signIn(page);

  const created = await page.request.post('/api/grading/sessions', {
    data: {
      examTitle: `Quét liên tục ${Date.now().toString(36)}`,
      className: `SCAN-${Date.now().toString(36).toUpperCase()}`,
      sheetMode: 'template',
      rubric: RUBRIC,
      expectedTotal: 10,
      students: [STUDENT],
    },
  });
  expect(created.ok(), await created.text()).toBe(true);
  const sessionId = (await created.json()).session.id as string;

  const sheet = await page.request.get(`/api/grading/sessions/${sessionId}/sheet?format=json`);
  const { template } = await sheet.json();

  const pairing = await page.request.post(`/api/grading/sessions/${sessionId}/pairings`);
  const { pairing: pair } = await pairing.json();
  const code = pair.code as string;

  // ---- the phone
  const phone = await browser.newContext({ viewport: { width: 390, height: 780 } });
  await phone.addInitScript(
    ({ template, picks, sbd, anchorHalf }) => {
      const drawSheet = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(template.page.width);
        canvas.height = Math.round(template.page.height);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';

        // Registration marks, exactly where the reader looks for them.
        for (const anchor of template.anchors) {
          ctx.fillRect(anchor.x - anchorHalf, anchor.y - anchorHalf, anchorHalf * 2, anchorHalf * 2);
        }

        const disc = (cx: number, cy: number, r: number) => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        };

        // Printed bubble outlines, then the marks a student would pencil in.
        for (const bubble of template.bubbles) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(bubble.cx, bubble.cy, bubble.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#000';
          if (picks[bubble.q] === bubble.label) disc(bubble.cx, bubble.cy, bubble.r * 0.78);
        }

        if (template.sbd) {
          for (const cell of template.sbd.cells) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(cell.cx, cell.cy, cell.r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#000';
            if (sbd[cell.column] === String(cell.digit)) disc(cell.cx, cell.cy, cell.r * 0.82);
          }
        }

        return canvas;
      };

      const getUserMedia = async () => {
        // A canvas stream is a real MediaStream, so the component runs unchanged.
        const canvas = drawSheet();
        (window as unknown as { __scanCanvas: HTMLCanvasElement }).__scanCanvas = canvas;
        return canvas.captureStream(15);
      };

      Object.defineProperty(navigator, 'mediaDevices', {
        configurable: true,
        value: { getUserMedia },
      });
    },
    { template, picks: PICKS, sbd: SBD, anchorHalf: ANCHOR_HALF },
  );

  const claimed = await phone.request.post(`/api/grading/pairings/${code}/claim`);
  expect(claimed.ok()).toBe(true);

  const screen = await phone.newPage();
  await screen.goto('/grading/capture');

  // The scanner recognises the sheet and files it with no tap at all.
  await expect(screen.getByText(STUDENT.name)).toBeVisible({ timeout: 20_000 });
  await expect(screen.getByText(/Đã nhận 1 tờ/)).toBeVisible();
  await expect(screen.getByText(/10 điểm/)).toBeVisible();

  // Identity came off the sheet: the bubbled candidate number matched the roster.
  const submissions = await page.request.get(`/api/grading/sessions/${sessionId}/submissions`);
  const rows = (await submissions.json()).submissions as Array<{
    studentName: string | null;
    totalScore: number | null;
    identityStatus: string;
  }>;
  expect(rows).toHaveLength(1);
  expect(rows[0]).toMatchObject({ studentName: STUDENT.name, totalScore: 10, identityStatus: 'verified' });

  // Held in front of the camera, the sheet must not be filed a second time.
  await screen.waitForTimeout(2_500);
  const again = await page.request.get(`/api/grading/sessions/${sessionId}/submissions`);
  expect((await again.json()).submissions).toHaveLength(1);

  await phone.close();
});
