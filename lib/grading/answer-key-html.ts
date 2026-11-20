/** Legacy HTML import & multi-format key parser. All imported keys require teacher review; no points are invented. */
import { formatTfStatements, parseTfStatements, type AnswerKeyQuestion } from './rubric';

function text(html: string): string {
  // Preserve the original LaTeX instead of KaTeX's duplicated display text.
  return html
    .replace(/<span\b[^>]*data-latex="([^"]*)"[^>]*>[\s\S]*?<\/span>/gi, '$1')
    .replace(/<annotation\b[^>]*>[\s\S]*?<\/annotation>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function points(value: string): string | undefined {
  const match = /^\s*\(?(\d+(?:[.,]\d+)?)\s*(?:điểm|đ)?\)?\s*$/i.exec(value);
  return match?.[1].replace('.', ',');
}

function number(label: string): number {
  return Number(/(?:(?:Câu|Bài)\s*)?(\d+)/i.exec(label)?.[1]);
}

export function parseAnswerKeyHtml(html: string): AnswerKeyQuestion[] {
  const result: AnswerKeyQuestion[] = [];
  const seenKeys = new Set<string>();

  function put(q: AnswerKeyQuestion, allowDuplicateNoAcrossSections = false) {
    const no = number(q.label);
    if (!Number.isInteger(no) || no <= 0) return;
    const key = allowDuplicateNoAcrossSections ? `${q.type ?? 'mc'}:${no}` : String(no);
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      result.push(q);
    }
  }

  for (const table of html.match(/<table\b[\s\S]*?<\/table>/gi) ?? []) {
    const rows = (table.match(/<tr\b[\s\S]*?<\/tr>/gi) ?? []).map((row) =>
      (row.match(/<t[dh]\b[\s\S]*?<\/t[dh]>/gi) ?? []).map(text),
    );

    if (/data-tf-grid\b/i.test(table)) {
      for (const cells of rows) {
        if (!/^(?:(?:Câu|Bài)\s*)?\d+$/i.test(cells[0] ?? '') || cells.length < 5) continue;
        const st = parseTfStatements(`${cells[1] ?? ''}${cells[2] ?? ''}${cells[3] ?? ''}${cells[4] ?? ''}`);
        if (!st) continue;
        const pts = points(cells[5] ?? '');
        put(
          {
            type: 'tf',
            label: `Câu ${number(cells[0])}`,
            answer: formatTfStatements(st),
            statements: st,
            ...(pts ? { points: pts } : {}),
          },
          true,
        );
      }
      continue;
    }

    if (/data-short-grid\b/i.test(table)) {
      for (const cells of rows) {
        if (!/^(?:(?:Câu|Bài)\s*)?\d+$/i.test(cells[0] ?? '') || !cells[1]?.trim()) continue;
        const pts = points(cells[2] ?? '');
        put(
          {
            type: 'short',
            label: `Câu ${number(cells[0])}`,
            answer: cells[1].trim(),
            ...(pts ? { points: pts } : {}),
          },
          true,
        );
      }
      continue;
    }

    const header = rows.findIndex((row) => /^Câu$/i.test(row[0] ?? '') && row.slice(1).some((cell) => /^\d+$/.test(cell)));
    if (header >= 0) {
      const labels = rows[header];
      const answers = rows.slice(header + 1).find((row) => /^Đáp án$/i.test(row[0] ?? ''));
      const scores = rows.slice(header + 1).find((row) => /^Điểm$/i.test(row[0] ?? ''));
      if (answers) {
        labels.slice(1).forEach((label, index) => {
          if (/^[A-D]$/i.test(answers[index + 1] ?? '')) {
            put({
              label: `Câu ${label}`,
              answer: answers[index + 1].toUpperCase(),
              ...(points(scores?.[index + 1] ?? '') ? { points: points(scores![index + 1]) } : {}),
            });
          }
        });
      }
      continue;
    }

    if (/data-rubric\b/i.test(table)) {
      let current: AnswerKeyQuestion | undefined;
      for (const cells of rows) {
        if (cells.length < 4 || /^Câu$/i.test(cells[0])) continue;
        if (/(?:Câu|Bài)\s*\d+/i.test(cells[0])) {
          const total = /\((\d+(?:[.,]\d+)?)\s*điểm\)/i.exec(cells[0])?.[1];
          current = {
            label: `Câu ${number(cells[0])}`,
            type: 'essay',
            answer: '',
            ...(total ? { points: total.replace('.', ',') } : {}),
            steps: [],
          };
          put(current, true);
        }
        if (current && cells[2]) {
          current.steps!.push({ text: cells[2], ...(points(cells[3]) ? { points: points(cells[3]) } : {}) });
        }
      }
      continue;
    }

    for (const cells of rows) {
      if (!/^(?:Câu\s*)?\d+$/i.test(cells[0] ?? '') || !/^[A-D]$/i.test(cells[1] ?? '')) continue;
      put({
        label: `Câu ${number(cells[0])}`,
        answer: cells[1].toUpperCase(),
        ...(points(cells[2] ?? '') ? { points: points(cells[2]) } : {}),
      });
    }
  }

  // Parse plain lines outside tables as well, without treating numeric point cells as answers.
  const plain = html.replace(/<table\b[\s\S]*?<\/table>/gi, '');
  for (const block of plain.split(/<\/(?:p|div|li|h\d)>|<br\s*\/?>/i)) {
    const line = text(block);
    const pattern = /(?:Câu\s*)?(\d{1,3})\s*[.:)\-–]\s*([A-D])(?!\p{L})/giu;
    for (let match = pattern.exec(line); match; match = pattern.exec(line)) {
      put({ label: `Câu ${match[1]}`, answer: match[2].toUpperCase() });
    }
  }

  const hasTypedSections = result.some((q) => q.type === 'tf' || q.type === 'short');
  return hasTypedSections
    ? result
    : [...result].sort((a, b) => number(a.label) - number(b.label));
}
