import type { AnswerKeyQuestion } from './rubric';

/**
 * The actual printable key emitted by the editor, kept completely self-contained
 * inside this single function so `renderAnswerKeyHtml.toString()` works in `new Function()` tests.
 */
export function renderAnswerKeyHtml(questions: AnswerKeyQuestion[], document: Document): string {
  const isTf = (q: AnswerKeyQuestion) => q.type === 'tf' || !!q.statements;
  const isShort = (q: AnswerKeyQuestion) => q.type === 'short';
  const isEssay = (q: AnswerKeyQuestion) => q.type === 'essay' || Boolean(q.steps?.length);

  const choiceQuestions = questions.filter((q) => !isEssay(q) && !isTf(q) && !isShort(q));
  const tfQuestions = questions.filter((q) => isTf(q));
  const shortQuestions = questions.filter((q) => isShort(q));
  const essayQuestions = questions.filter((q) => isEssay(q));

  const boldCell = (txt: string) => {
    const td = document.createElement('td');
    const p = document.createElement('p');
    const b = document.createElement('b');
    b.textContent = txt;
    p.appendChild(b);
    td.appendChild(p);
    return td;
  };
  const textCell = (txt: string) => {
    const td = document.createElement('td');
    const p = document.createElement('p');
    p.textContent = txt;
    td.appendChild(p);
    return td;
  };

  const section = document.createElement('div');
  section.setAttribute('data-answer-key', '');
  section.setAttribute('data-answer-key-version', '1');
  section.style.breakInside = 'avoid';

  const heading = document.createElement('h1');
  heading.textContent = 'HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM';
  heading.style.textAlign = 'center';
  section.appendChild(heading);

  const generalTitle = document.createElement('h3');
  generalTitle.textContent = 'A. HƯỚNG DẪN CHUNG';
  section.appendChild(generalTitle);
  const generalText = document.createElement('p');
  generalText.textContent = 'Học sinh làm theo cách khác, nếu đúng vẫn cho điểm tối đa.';
  section.appendChild(generalText);

  const keyTitle = document.createElement('h3');
  keyTitle.textContent = 'B. ĐÁP ÁN VÀ THANG ĐIỂM';
  section.appendChild(keyTitle);

  if (choiceQuestions.length) {
    const label = document.createElement('p');
    label.textContent = 'I. Trắc nghiệm nhiều lựa chọn';
    section.appendChild(label);

    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('data-answer-grid', '');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    const rowLabels = document.createElement('tr');
    rowLabels.appendChild(boldCell('Câu'));
    const rowAnswers = document.createElement('tr');
    rowAnswers.appendChild(boldCell('Đáp án'));

    for (const q of choiceQuestions) {
      const n = /(\d+)/.exec(q.label)?.[1] ?? q.label;
      rowLabels.appendChild(boldCell(n));
      rowAnswers.appendChild(textCell(q.answer));
    }

    table.appendChild(rowLabels);
    table.appendChild(rowAnswers);
    const rowPoints = document.createElement('tr');
    for (const value of ['Điểm', ...choiceQuestions.map((q) => q.points ?? '')]) {
      const cell = document.createElement('td');
      cell.textContent = value;
      rowPoints.appendChild(cell);
    }
    table.appendChild(rowPoints);
    section.appendChild(table);
  }

  if (tfQuestions.length) {
    const label = document.createElement('p');
    label.textContent = 'II. Trắc nghiệm Đúng/Sai';
    section.appendChild(label);

    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('data-tf-grid', '');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    const head = document.createElement('tr');
    for (const col of ['Câu', 'a', 'b', 'c', 'd', 'Điểm']) head.appendChild(boldCell(col));
    table.appendChild(head);

    for (const q of tfQuestions) {
      const tr = document.createElement('tr');
      const n = /(\d+)/.exec(q.label)?.[1] ?? q.label;
      tr.appendChild(boldCell(`Câu ${n}`));
      const flags = q.statements
        ? [q.statements.a ? 'Đ' : 'S', q.statements.b ? 'Đ' : 'S', q.statements.c ? 'Đ' : 'S', q.statements.d ? 'Đ' : 'S']
        : (q.answer || 'ĐSĐS').toUpperCase().replace(/[^ĐDSTF]/g, '').slice(0, 4).split('').map((c) => (c === 'Đ' || c === 'D' || c === 'T' ? 'Đ' : 'S'));
      for (let i = 0; i < 4; i += 1) tr.appendChild(textCell(flags[i] ?? 'S'));
      tr.appendChild(textCell(q.points ?? ''));
      table.appendChild(tr);
    }
    section.appendChild(table);
  }

  if (shortQuestions.length) {
    const label = document.createElement('p');
    label.textContent = 'III. Trắc nghiệm trả lời ngắn';
    section.appendChild(label);

    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('data-short-grid', '');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    const head = document.createElement('tr');
    for (const col of ['Câu', 'Đáp án', 'Điểm']) head.appendChild(boldCell(col));
    table.appendChild(head);

    for (const q of shortQuestions) {
      const tr = document.createElement('tr');
      const n = /(\d+)/.exec(q.label)?.[1] ?? q.label;
      tr.appendChild(boldCell(`Câu ${n}`));
      tr.appendChild(textCell(q.answer));
      tr.appendChild(textCell(q.points ?? ''));
      table.appendChild(tr);
    }
    section.appendChild(table);
  }

  if (essayQuestions.length) {
    const sub = document.createElement('h3');
    sub.textContent = 'Hướng dẫn chấm phần tự luận';
    section.appendChild(sub);

    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('data-rubric', '');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';

    const head = document.createElement('tr');
    for (const text of ['Câu', 'Ý', 'Nội dung', 'Điểm']) head.appendChild(boldCell(text));
    table.appendChild(head);

    for (const q of essayQuestions) {
      const steps = q.steps ?? [];
      steps.forEach((step, i) => {
        const tr = document.createElement('tr');

        const cLabel = document.createElement('td');
        if (i === 0) {
          const p = document.createElement('p');
          const b = document.createElement('b');
          b.textContent = q.label;
          p.appendChild(b);
          if (q.points) {
            p.appendChild(document.createElement('br'));
            const it = document.createElement('i');
            it.textContent = `(${q.points} điểm)`;
            p.appendChild(it);
          }
          cLabel.appendChild(p);
        }
        tr.appendChild(cLabel);

        const cY = document.createElement('td');
        cY.appendChild(document.createElement('p'));
        tr.appendChild(cY);

        tr.appendChild(textCell(step.text));
        tr.appendChild(textCell(step.points ?? ''));
        table.appendChild(tr);
      });
    }
    section.appendChild(table);
  }

  return section.innerHTML;
}
