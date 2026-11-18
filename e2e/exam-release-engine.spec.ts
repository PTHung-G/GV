import { test, expect } from "@playwright/test";
import { buildReleaseVariants } from "../lib/exam-release/engine";
import {
  generateRecipe,
  recipeDomainSize,
  RECIPE_IDS,
} from "../lib/exam-release/recipes";
import { examContentHash } from "../lib/exam-revision";
import type { ReleaseInput } from "../lib/exam-release/types";
function question(n: number, dependent = false) {
  return `<p><b>Câu ${n}.</b> UNIQUE_${n} $x_${n}=2$ <svg viewBox="0 0 10 10"><path d="M0 0L10 10"/></svg></p><div class="doc-grid">${["A", "B", "C", "D"].map((l) => `<div class="doc-grid-cell"><p>${l}. option_${n}_${l}${dependent && l === "D" ? " cả A và B" : ""}</p></div>`).join("")}</div>`;
}
function input(patch: Partial<ReleaseInput> = {}): ReleaseInput {
  return {
    sourceExamId: "source",
    title: "Toán",
    content:
      "<h1>ĐỀ THI</h1><h3>PHẦN I</h3>" +
      [1, 2, 3, 4].map((n) => question(n)).join(""),
    answerKey: [1, 2, 3, 4].map((n) => ({
      label: String(n),
      answer: "ABCD"[n - 1],
      points: "0,5",
    })),
    reviewed: true,
    codes: ["101", "102", "103"],
    seed: "fixed",
    shuffleOptions: true,
    shuffleQuestions: true,
    ...patch,
  };
}
test("deterministic variants preserve exact formula SVG option bodies, totals and remapped answers across seeds", () => {
  for (let seed = 0; seed < 40; seed++) {
    const source = input({ seed: String(seed) });
    const build = buildReleaseVariants(source);
    expect(buildReleaseVariants(source)).toEqual(build);
    for (const v of build.variants) {
      expect(v.rubric.totalPoints).toBe(2);
      expect(v.mapping.map((m) => m.sourceNo).sort()).toEqual([1, 2, 3, 4]);
      for (const m of v.mapping) {
        expect(v.examHtml.split(`UNIQUE_${m.sourceNo}`).length - 1).toBe(1);
        expect(v.examHtml).toContain(`$x_${m.sourceNo}=2$`);
        for (const l of "ABCD")
          expect(v.examHtml.split(`option_${m.sourceNo}_${l}`).length - 1).toBe(
            1,
          );
        const original = "ABCD"[m.sourceNo - 1];
        expect(
          v.answerKey.find((k) => k.label === String(m.printedNo))?.answer,
        ).toBe("ABCD"[m.optionOrder!.indexOf(original)]);
      }
      expect(v.examHtml.match(/<path d="M0 0L10 10"\/>/g)).toHaveLength(4);
    }
  }
});
test("section isolation, atomic group order and absolute pins", () => {
  const source = input({
    content:
      "<h3>PHẦN I</h3>" +
      [1, 2, 3, 4, 5].map((n) => question(n)).join("") +
      "<h3>PHẦN II</h3>" +
      question(6),
    answerKey: [1, 2, 3, 4, 5, 6].map((n) => ({
      label: String(n),
      answer: "A",
      points: "1",
    })),
    groups: [{ questionNos: [1, 2] }, { questionNos: [3, 4] }],
    pinnedQuestionNos: [5],
  });
  for (let seed = 0; seed < 20; seed++)
    for (const v of buildReleaseVariants({ ...source, seed: String(seed) })
      .variants) {
      expect(v.mapping.find((m) => m.sourceNo === 5)?.printedNo).toBe(5);
      expect(v.mapping.find((m) => m.sourceNo === 6)?.printedNo).toBe(6);
      const one = v.mapping.findIndex((m) => m.sourceNo === 1);
      expect(v.mapping[one + 1].sourceNo).toBe(2);
      expect(v.examHtml.indexOf("PHẦN II")).toBeGreaterThan(
        v.examHtml.indexOf("UNIQUE_5"),
      );
    }
});
test("dependent options remain pinned without marker replacement inside bodies", () => {
  const b = buildReleaseVariants(
    input({
      content: question(1, true),
      answerKey: [{ label: "1", answer: "D", points: "1" }],
      shuffleQuestions: false,
    }),
  );
  for (const v of b.variants) {
    expect(v.answerKey[0].answer).toBe("D");
    expect(v.examHtml).toContain("D. option_1_D cả A và B");
    expect(v.mapping[0].optionOrder).toBeUndefined();
  }
  expect(b.questions[0].canShuffleOptions).toBe(false);
  expect(b.warnings.length).toBeGreaterThan(0);
});
test("strict validation rejects missing points, stale keys, unknown groups and ambiguous structures", () => {
  expect(() =>
    buildReleaseVariants(input({ answerKey: [{ label: "1", answer: "A" }] })),
  ).toThrow(/chưa có điểm/);
  expect(() =>
    buildReleaseVariants(input({ sourceContentHash: examContentHash("old") })),
  ).toThrow(/thay đổi/);
  expect(() =>
    buildReleaseVariants(input({ groups: [{ questionNos: [1, 3] }] })),
  ).toThrow(/liên tiếp/);
  expect(() =>
    buildReleaseVariants(
      input({ groups: [{ questionNos: [1, 2] }, { questionNos: [2, 3] }] }),
    ),
  ).toThrow(/trùng/);
  expect(() =>
    buildReleaseVariants(input({ content: "<div>" + question(1) + "</div>" })),
  ).toThrow(/tắt trộn/);
  expect(() =>
    buildReleaseVariants(input({ content: question(1) + question(1) })),
  ).toThrow(/trùng/);
  expect(() =>
    buildReleaseVariants(
      input({
        content: question(1).replace("B. option", "Z. option"),
        answerKey: [{ label: "1", answer: "A", points: "1" }],
      }),
    ),
  ).toThrow(/bốn lựa chọn/);
});
test("no-transform preserves arbitrary reviewed original byte-for-byte with no guessed structure", () => {
  const content =
    '<div><h4>Tài liệu lồng</h4><p>$x^2$</p><svg><path d="M1 2"/></svg></div>';
  const b = buildReleaseVariants(
    input({
      content,
      codes: ["original"],
      shuffleQuestions: false,
      shuffleOptions: false,
      answerKey: [{ label: "1", answer: "A", points: "1" }],
    }),
  );
  expect(b.variants[0].examHtml).toBe(content);
  expect(b.warnings[0]).toContain("Giữ nguyên");
});
test("finite recipes verify all cases with four exact distinct choices and deterministic provenance", () => {
  for (const id of RECIPE_IDS)
    for (let n = 0; n < recipeDomainSize(id); n++) {
      const r = generateRecipe(id, n, 1);
      expect(r.provenance.verified).toBe(true);
      expect(r.values.length).toBe(4);
      expect(new Set(r.values).size).toBe(4);
      expect(generateRecipe(id, n, 1)).toEqual(r);
      const p = r.provenance.params;
      if (id === "square-root")
        expect(Number(r.values[0]) ** 2).toBe(p.radicand);
      if (id === "linear-equation")
        expect(p.a * Number(r.values[0]) + p.b).toBe(p.c);
      if (id === "rational-addition") {
        const [a, d] = r.values[0].split("/").map(Number);
        expect(a * p.d).toBe((p.a + p.b) * (d ?? 1));
      }
    }
});
test("shared passage moves with explicit atomic group, references reject, duplicate variants reported", () => {
  const between =
    "<h3>PHẦN I</h3>" +
    question(1) +
    "<p>BETWEEN_PASSAGE</p>" +
    question(2) +
    question(3) +
    question(4);
  expect(() => buildReleaseVariants(input({ content: between }))).toThrow(
    /ngữ cảnh/,
  );
  for (const v of buildReleaseVariants(
    input({ content: between, groups: [{ questionNos: [2, 3] }] }),
  ).variants) {
    expect(v.examHtml.split("BETWEEN_PASSAGE")).toHaveLength(2);
    expect(v.examHtml.indexOf("BETWEEN_PASSAGE")).toBeLessThan(
      v.examHtml.indexOf("UNIQUE_2"),
    );
  }
  const content =
    "<h3>PHẦN I</h3><p>PASSAGE_SHARED</p>" +
    question(1) +
    question(2) +
    question(3) +
    question(4);
  expect(() => buildReleaseVariants(input({ content }))).toThrow(/nhóm/);
  const global =
    '<p style="text-align:center">Thời gian 45 phút. Chọn một đáp án.</p>';
  expect(() =>
    buildReleaseVariants(input({ content: global + input().content })),
  ).toThrow(/hướng dẫn chung/);
  const fixed = buildReleaseVariants(
    input({
      content: global + input().content,
      globalInstructionsReviewed: true,
    }),
  );
  for (const v of fixed.variants)
    expect(v.examHtml.startsWith(global)).toBe(true);
  const build = buildReleaseVariants(
    input({
      content,
      groups: [{ questionNos: [1, 2] }, { questionNos: [3, 4] }],
    }),
  );
  for (const v of build.variants) {
    expect(v.examHtml.split("PASSAGE_SHARED")).toHaveLength(2);
    expect(v.examHtml.indexOf("PASSAGE_SHARED")).toBeLessThan(
      v.examHtml.indexOf("UNIQUE_1"),
    );
    const at = v.mapping.findIndex((m) => m.sourceNo === 1);
    expect(v.mapping[at + 1].sourceNo).toBe(2);
  }
  expect(() =>
    buildReleaseVariants(
      input({
        content:
          question(1).replace("UNIQUE_1", "Dựa vào câu trên") +
          question(2) +
          question(3) +
          question(4),
      }),
    ),
  ).toThrow(/tham chiếu/);
  const dup = buildReleaseVariants(
    input({
      content: question(1),
      answerKey: [{ label: "1", answer: "A", points: "1" }],
      pinnedOptionNos: [1],
    }),
  );
  expect(dup.warnings.some((w) => w.includes("trùng hoán vị"))).toBe(true);
});

test("recipe replaces only selected MC question and remaps its answer safely", () => {
  const b = buildReleaseVariants(
    input({ recipes: [{ questionNo: 2, recipeId: "square-root" }] }),
  );
  for (const v of b.variants) {
    expect(v.examHtml).not.toContain("UNIQUE_2");
    expect(v.examHtml).toContain("UNIQUE_1");
    const m = v.mapping.find((m) => m.sourceNo === 2)!;
    expect(m.recipe?.verified).toBe(true);
    expect(
      v.answerKey.find((k) => k.label === String(m.printedNo))?.answer,
    ).toBe("ABCD"[m.optionOrder!.indexOf("A")]);
    expect(v.examHtml).not.toContain("Vì");
  }
});
