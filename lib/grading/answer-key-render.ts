import type { AnswerKeyQuestion } from './rubric';

/** The actual printable key emitted by the editor, kept pure for round-trip tests. */
export function renderAnswerKeyHtml(questions: AnswerKeyQuestion[], document: Document): string {
      // Essay questions carry a scoring rubric; multiple-choice ones do not.
      const choiceQuestions = questions.filter((q) => !q.steps?.length);
      const essayQuestions = questions.filter((q) => q.steps?.length);

      // The key is its own document, so it never mixes into the exam sheet the
      // teacher prints for students.
      const section = document.createElement('div');
      section.setAttribute('data-answer-key', '');
      section.setAttribute('data-answer-key-version', '1');
      // Keep the key together on one sheet when it fits.
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

      // Multiple choice: a "Câu | 1 | 2 …" / "Đáp án | B | A …" table, which is
      // how the original site lays the key out.
      if (choiceQuestions.length) {
        const label = document.createElement('p');
        label.textContent = 'I. Trắc nghiệm';
        section.appendChild(label);

        const table = document.createElement('table');
        table.setAttribute('border', '1');
        table.setAttribute('data-answer-grid', '');
        table.style.borderCollapse = 'collapse';
        table.style.width = '100%';

        const rowLabels = document.createElement('tr');
        const corner = document.createElement('td');
        const cornerP = document.createElement('p');
        const cornerB = document.createElement('b');
        cornerB.textContent = 'Câu';
        cornerP.appendChild(cornerB);
        corner.appendChild(cornerP);
        rowLabels.appendChild(corner);

        const rowAnswers = document.createElement('tr');
        const answerHead = document.createElement('td');
        const answerHeadP = document.createElement('p');
        const answerHeadB = document.createElement('b');
        answerHeadB.textContent = 'Đáp án';
        answerHeadP.appendChild(answerHeadB);
        answerHead.appendChild(answerHeadP);
        rowAnswers.appendChild(answerHead);

        for (const q of choiceQuestions) {
          const n = /(\d+)/.exec(q.label)?.[1] ?? q.label;

          const cNum = document.createElement('td');
          const pNum = document.createElement('p');
          const bNum = document.createElement('b');
          bNum.textContent = n;
          pNum.appendChild(bNum);
          cNum.appendChild(pNum);
          rowLabels.appendChild(cNum);

          const cAns = document.createElement('td');
          const pAns = document.createElement('p');
          pAns.textContent = q.answer;
          cAns.appendChild(pAns);
          rowAnswers.appendChild(cAns);
        }

        table.appendChild(rowLabels);
        table.appendChild(rowAnswers);
        const rowPoints = document.createElement('tr');
        for (const value of ['Điểm', ...choiceQuestions.map(q => q.points ?? '')]) {
          const cell = document.createElement('td');
          cell.textContent = value;
          rowPoints.appendChild(cell);
        }
        table.appendChild(rowPoints);
        section.appendChild(table);
      }

      // Essay questions: one rubric table (Câu | Ý | Nội dung | Điểm), matching
      // the layout the original site produces.
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
        for (const text of ['Câu', 'Ý', 'Nội dung', 'Điểm']) {
          const th = document.createElement('td');
          const p = document.createElement('p');
          const b = document.createElement('b');
          b.textContent = text;
          p.appendChild(b);
          th.appendChild(p);
          head.appendChild(th);
        }
        table.appendChild(head);

        for (const q of essayQuestions) {
          const steps = q.steps ?? [];
          steps.forEach((step, i) => {
            const tr = document.createElement('tr');

            // Label + total points on the first row of the question only.
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

            const cText = document.createElement('td');
            const pText = document.createElement('p');
            pText.textContent = step.text;
            cText.appendChild(pText);
            tr.appendChild(cText);

            const cPoints = document.createElement('td');
            const pPoints = document.createElement('p');
            pPoints.textContent = step.points ?? '';
            cPoints.appendChild(pPoints);
            tr.appendChild(cPoints);

            table.appendChild(tr);
          });
        }
        section.appendChild(table);
      }

  return section.innerHTML;
}
