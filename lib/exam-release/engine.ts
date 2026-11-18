import { parseFragment, type DefaultTreeAdapterMap } from "parse5";
import { examContentHash } from "../exam-revision";
import { normalizeRubric, rubricFromAnswerKey } from "../grading/rubric";
import type {
  ReleaseInput,
  ReleaseBuild,
  BuiltVariant,
  AnswerKeyQuestion,
} from "./types";
import { generateRecipe, recipeDomainSize } from "./recipes";
type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];
type Text = DefaultTreeAdapterMap["textNode"];
type Patch = { start: number; end: number; text: string };
type Question = {
  no: number;
  start: number;
  end: number;
  section: number;
  label: Patch;
  options?: { start: number; end: number; label: Patch; letter: string }[];
  dependent: boolean;
};
function fail(message: string): never {
  throw new Error(
    `${message} Hãy sửa cấu trúc câu/nhóm hoặc tắt trộn câu, trộn đáp án và mẫu số liệu để xuất một mã giữ nguyên đề.`,
  );
}
function children(n: Node): Node[] {
  return "childNodes" in n ? n.childNodes : [];
}
function text(n: Node): string {
  return n.nodeName === "#text"
    ? (n as Text).value
    : children(n).map(text).join("");
}
function texts(n: Node): Text[] {
  return n.nodeName === "#text" ? [n as Text] : children(n).flatMap(texts);
}
function attr(n: Node, name: string): string {
  return "attrs" in n
    ? (n.attrs.find((a) => a.name === name)?.value ?? "")
    : "";
}
function patch(source: string, changes: Patch[]): string {
  let end = source.length;
  let result = source;
  for (const p of [...changes].sort((a, b) => b.start - a.start)) {
    if (p.start < 0 || p.end > end || p.end < p.start)
      fail("Vị trí thay thế chồng lấn.");
    result = result.slice(0, p.start) + p.text + result.slice(p.end);
    end = p.start;
  }
  return result;
}
function rng(seed: string): () => number {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled<T>(items: T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
function parse(
  content: string,
  groupStarts: number[] = [],
  requireMovableContext = false,
): Question[] {
  const errors: unknown[] = [];
  const ast = parseFragment(content, {
    sourceCodeLocationInfo: true,
    onParseError: (e) => errors.push(e),
  });
  if (errors.length) fail("HTML không hợp lệ nên chưa thể trộn an toàn.");
  let section = 0;
  const out: Question[] = [];
  for (const node of ast.childNodes) {
    if (node.nodeName === "#text") {
      if (text(node).trim()) fail("Văn bản nằm ngoài khối HTML.");
      continue;
    }
    if (!("tagName" in node)) continue;
    const value = text(node).trim();
    const marker = /^Câu\s+(\d+)\s*[.:)]/iu.exec(value);
    if (
      /^h[1-6]$/.test(node.tagName) &&
      /^(?:PHẦN|Phần|SECTION)\s/u.test(value)
    ) {
      section++;
      continue;
    }
    if (!marker) {
      if (
        texts(node).some((t) => /(?:^|\n)\s*Câu\s+\d+\s*[.:)]/iu.test(t.value))
      )
        fail("Câu hỏi lồng trong khối chưa hỗ trợ; đưa mỗi câu ra khối riêng.");
      continue;
    }
    if (!/^(p|h[1-6])$/.test(node.tagName))
      fail("Mỗi câu cần bắt đầu bằng khối đoạn văn riêng.");
    const first = texts(node).find((t) => t.value.trim());
    const m = first && /^\s*Câu\s+(\d+)\s*[.:)]/iu.exec(first.value);
    if (!first || !m || !first.sourceCodeLocation || !node.sourceCodeLocation)
      fail("Nhãn Câu bị chia nhỏ; đặt trọn nhãn trong cùng một phần văn bản.");
    const no = Number(marker[1]);
    if (out.some((q) => q.no === no))
      fail("Số câu bị trùng hoặc đánh số lại theo phần.");
    const digitOffset = m[0].indexOf(m[1]);
    const start = first.sourceCodeLocation.startOffset + digitOffset;
    if (content.slice(start, start + m[1].length) !== m[1])
      fail("Nhãn câu dùng mã HTML chưa hỗ trợ.");
    out.push({
      no,
      start: node.sourceCodeLocation.startOffset,
      end: content.length,
      section,
      label: { start, end: start + m[1].length, text: m[1] },
      dependent: false,
    });
  }
  if (!out.length) fail("Không nhận diện được câu hỏi.");
  // Section headers are fixed separators, never attached to a moving question.
  for (let i = 0; i < out.length; i++) {
    const q = out[i];
    let end = out[i + 1]?.start ?? content.length;
    for (const n of ast.childNodes) {
      const loc = n.sourceCodeLocation;
      if (
        loc &&
        loc.startOffset > q.start &&
        loc.startOffset < end &&
        "tagName" in n &&
        /^h[1-6]$/.test(n.tagName) &&
        /^(?:PHẦN|Phần|SECTION)\s/u.test(text(n).trim())
      )
        end = loc.startOffset;
    }
    q.end = end;
    const nodes = ast.childNodes.filter(
      (n) =>
        n.sourceCodeLocation &&
        n.sourceCodeLocation.startOffset >= q.start &&
        n.sourceCodeLocation.endOffset <= q.end,
    );
    const grids = nodes.filter((n) =>
      attr(n, "class").split(/\s/).includes("doc-grid"),
    );
    if (grids.length > 1) fail(`Câu ${q.no} có nhiều khối lựa chọn.`);
    if (grids.length === 1) {
      const grid = grids[0];
      const cells = children(grid).filter(
        (n) => n.nodeName !== "#text" || text(n).trim(),
      );
      if (cells.length === 4) {
        const opts: NonNullable<Question["options"]> = [];
        for (let j = 0; j < 4; j++) {
          const cell = cells[j],
            loc = cell.sourceCodeLocation,
            t = texts(cell).find((t) => t.value.trim()),
            m = t && /^\s*([A-D])\s*[.)]/.exec(t.value);
          if (!loc || !t?.sourceCodeLocation || !m || m[1] !== "ABCD"[j]) {
            opts.length = 0;
            break;
          }
          const p = t.sourceCodeLocation.startOffset + m[0].indexOf(m[1]);
          if (content[p] !== m[1]) {
            opts.length = 0;
            break;
          }
          opts.push({
            start: loc.startOffset,
            end: loc.endOffset,
            label: { start: p, end: p + 1, text: m[1] },
            letter: m[1],
          });
        }
        if (opts.length === 4) q.options = opts;
      }
      // Prose after choices may introduce the next question's shared context.
      const after = nodes.filter(
        (n) =>
          n.sourceCodeLocation!.startOffset >=
            grid.sourceCodeLocation!.endOffset && text(n).trim(),
      );
      if (after.length && requireMovableContext) {
        const next = out[i + 1];
        if (
          !next ||
          !groupStarts.includes(next.no) ||
          next.section !== q.section
        )
          fail(
            `Câu ${q.no} có ngữ cảnh sau lựa chọn chưa rõ thuộc câu nào; gom câu tiếp theo vào nhóm có ngữ cảnh hoặc tắt trộn câu.`,
          );
        const begin = after[0].sourceCodeLocation!.startOffset;
        q.end = begin;
        next.start = begin;
      }
    }
    q.dependent =
      /(?:\b[A-D]\s*(?:và|hoặc|,|đều)|(?:đáp án|phương án|lựa chọn)\s+[A-D]|tất cả|cả bốn|cả ba|ở trên|nêu trên|câu\s+\d+)/iu.test(
        nodes
          .map(text)
          .join(" ")
          .replace(/^\s*Câu\s+\d+\s*[.:)]/iu, ""),
      );
  }
  return out;
}
function keyNo(q: AnswerKeyQuestion): number {
  const m = /^(?:Câu\s*)?(\d+)[.:)]?$/iu.exec(q.label.trim());
  if (!m) fail("Nhãn đáp án cần là số câu hoặc “Câu N”.");
  return Number(m[1]);
}
export function buildReleaseVariants(input: ReleaseInput): ReleaseBuild {
  if (!input || !input.reviewed)
    throw new Error("Hãy rà soát đề và barem rồi xác nhận trước khi chốt.");
  if (
    typeof input.content !== "string" ||
    input.content.length > 160000 ||
    !input.content.trim()
  )
    throw new Error("Nội dung đề trống hoặc vượt 160.000 ký tự.");
  if (
    !input.sourceExamId ||
    !input.title?.trim() ||
    typeof input.seed !== "string" ||
    input.seed.length > 200
  )
    throw new Error("Thiếu thông tin đề hoặc hạt giống không hợp lệ.");
  if (
    !Array.isArray(input.codes) ||
    input.codes.length < 1 ||
    input.codes.length > 12 ||
    input.codes.some(
      (c) => typeof c !== "string" || !/^[A-Za-z0-9_-]{1,24}$/.test(c),
    ) ||
    new Set(input.codes).size !== input.codes.length
  )
    throw new Error(
      "Nhập 1–12 mã đề riêng biệt, chỉ gồm chữ, số, gạch ngang hoặc gạch dưới.",
    );
  if (
    input.sourceContentHash &&
    input.sourceContentHash !== examContentHash(input.content)
  )
    throw new Error(
      "Đề đã thay đổi so với barem. Hãy cập nhật đáp án trước khi chốt.",
    );
  if (
    !Array.isArray(input.answerKey) ||
    !input.answerKey.length ||
    input.answerKey.length > 200
  )
    throw new Error("Barem cần từ 1 đến 200 câu.");
  const key = input.answerKey.map((q) => ({
    ...q,
    steps: q.steps?.map((s) => ({ ...s })),
  }));
  if (
    key.some(
      (q) =>
        q.type === "mc" &&
        (!/^[A-D]$/i.test(q.answer?.trim()) || q.steps?.length),
    )
  )
    throw new Error(
      "Câu trắc nghiệm phải có đúng một đáp án A–D và không có thang bước tự luận.",
    );
  const nos = key.map(keyNo);
  if (new Set(nos).size !== nos.length)
    throw new Error("Barem có số câu trùng.");
  const rubric = normalizeRubric(rubricFromAnswerKey(key));
  if (rubric.questions.filter((q) => q.type === "mc").length > 60)
    throw new Error("Phiếu tô hỗ trợ tối đa 60 câu A–D.");
  const transform =
    input.shuffleQuestions || input.shuffleOptions || !!input.recipes?.length;
  if (!transform) {
    if (input.codes.length !== 1)
      throw new Error(
        "Nhiều mã giống nhau: hãy bật trộn hoặc xuất một mã giữ nguyên.",
      );
    return {
      algorithmVersion: 1,
      warnings: [
        "Giữ nguyên HTML nguồn; không phân tích hay thay đổi cấu trúc câu.",
      ],
      questions: nos.map((no, i) => ({
        no,
        label: key[i].label,
        canShuffleOptions: false,
        warnings: ["Bản giữ nguyên chưa xác minh cấu trúc lựa chọn."],
      })),
      variants: [
        {
          code: input.codes[0],
          examHtml: input.content,
          answerKey: key,
          rubric,
          mapping: nos.map((no) => ({ sourceNo: no, printedNo: no })),
        },
      ],
    };
  }
  const questions = parse(
    input.content,
    (input.groups ?? []).map((g) => g.questionNos[0]),
    input.shuffleQuestions,
  );
  if (input.shuffleQuestions) {
    const ast = parseFragment(input.content, { sourceCodeLocationInfo: true });
    const firstSection = ast.childNodes.find(
      (n) =>
        "tagName" in n &&
        /^h[1-6]$/.test(n.tagName) &&
        /^(?:PHẦN|Phần|SECTION)\s/u.test(text(n).trim()),
    );
    if (
      firstSection?.sourceCodeLocation &&
      !input.globalInstructionsReviewed &&
      ast.childNodes.some(
        (n) =>
          n.sourceCodeLocation &&
          n.sourceCodeLocation.endOffset <=
            firstSection.sourceCodeLocation!.startOffset &&
          "tagName" in n &&
          n.tagName === "p" &&
          text(n).trim(),
      )
    )
      fail(
        "Hãy xác nhận các đoạn trước phần đầu là hướng dẫn chung; ngữ liệu riêng cần đặt ngay trước nhóm câu.",
      );
    for (const first of questions.filter(
      (q, i) => i === 0 || q.section !== questions[i - 1].section,
    )) {
      const headerEnd = Math.max(
        0,
        ...ast.childNodes
          .filter(
            (n) =>
              n.sourceCodeLocation &&
              n.sourceCodeLocation.endOffset <= first.start &&
              "tagName" in n &&
              /^h[1-6]$/.test(n.tagName) &&
              /^(?:PHẦN|Phần|SECTION)\s/u.test(text(n).trim()),
          )
          .map((n) => n.sourceCodeLocation!.endOffset),
      );
      const before = ast.childNodes.filter(
        (n) =>
          n.sourceCodeLocation &&
          n.sourceCodeLocation.startOffset >= headerEnd &&
          n.sourceCodeLocation.endOffset <= first.start &&
          "tagName" in n &&
          n.tagName === "p" &&
          text(n).trim(),
      );
      if (before.length) {
        if (input.groups?.some((g) => g.questionNos[0] === first.no)) {
          first.start = before[0].sourceCodeLocation!.startOffset;
        } else if (!input.globalInstructionsReviewed)
          fail(
            "Có đoạn văn trước câu đầu: hãy xác nhận đây chỉ là hướng dẫn chung, tạo nhóm ngữ cảnh hoặc tắt trộn câu.",
          );
      }
    }
  }
  if (
    input.shuffleQuestions &&
    /(?:theo|ở|tại|trong|của|xem|như|từ)\s+câu\s+\d+|câu\s+(?:trên|trước|sau)/iu.test(
      text(parseFragment(input.content)),
    )
  )
    fail(
      "Có tham chiếu số/thứ tự câu trong nội dung; ghim riêng không thể bảo đảm tham chiếu sau đổi số. Hãy tắt trộn câu.",
    );
  if (
    questions.length !== nos.length ||
    questions.some((q) => !nos.includes(q.no))
  )
    fail("Số câu trong đề không khớp một-một với barem.");
  const known = new Set(nos);
  for (const list of [
    input.pinnedQuestionNos ?? [],
    input.pinnedOptionNos ?? [],
  ])
    if (new Set(list).size !== list.length || list.some((n) => !known.has(n)))
      fail("Danh sách câu ghim không hợp lệ.");
  const grouped = new Set<number>();
  const groups = input.groups ?? [];
  for (const g of groups) {
    if (
      !g.questionNos.length ||
      g.questionNos.some((n) => !known.has(n) || grouped.has(n))
    )
      fail("Nhóm câu trống, trùng hoặc có câu không tồn tại.");
    const indexes = g.questionNos.map((n) =>
      questions.findIndex((q) => q.no === n),
    );
    if (
      indexes.some((n, i) => i > 0 && n !== indexes[i - 1] + 1) ||
      g.questionNos.some(
        (n) =>
          questions.find((q) => q.no === n)!.section !==
          questions[indexes[0]].section,
      )
    )
      fail("Nhóm phải gồm các câu liên tiếp, cùng một phần và đúng thứ tự.");
    g.questionNos.forEach((n) => grouped.add(n));
  }
  const recipes = input.recipes ?? [];
  if (
    new Set(recipes.map((r) => r.questionNo)).size !== recipes.length ||
    recipes.some(
      (r) =>
        !known.has(r.questionNo) ||
        rubric.questions.find((q) => q.no === r.questionNo)?.type !== "mc",
    )
  )
    fail("Chỉ áp dụng một mẫu số liệu cho mỗi câu A–D hợp lệ.");
  const warnings: string[] = [];
  const variants: BuiltVariant[] = input.codes.map((code) => {
    const random = rng(`${input.seed}\0${code}`);
    const ordered: Question[] = [];
    for (const section of [...new Set(questions.map((q) => q.section))]) {
      const qs = questions.filter((q) => q.section === section);
      const units: Question[][] = [];
      for (let i = 0; i < qs.length; i++) {
        const g = groups.find((g) => g.questionNos[0] === qs[i].no);
        if (g) {
          units.push(qs.slice(i, i + g.questionNos.length));
          i += g.questionNos.length - 1;
        } else units.push([qs[i]]);
      }
      const pinned = (u: Question[]) =>
        u.some((q) => input.pinnedQuestionNos?.includes(q.no)) ||
        groups.some((g) => g.pinned && g.questionNos[0] === u[0].no);
      // Equal-sized unit slots preserve every pinned question's absolute position.
      const buckets = new Map<number, Question[][]>();
      for (const size of new Set(units.map((u) => u.length)))
        buckets.set(
          size,
          shuffled(
            units.filter((u) => !pinned(u) && u.length === size),
            random,
          ),
        );
      ordered.push(
        ...units.flatMap((u) =>
          input.shuffleQuestions && !pinned(u)
            ? buckets.get(u.length)!.shift()!
            : u,
        ),
      );
    }
    const mapping: BuiltVariant["mapping"] = [];
    const answerKey: AnswerKeyQuestion[] = [];
    const replacements: Patch[] = [];
    for (let i = 0; i < ordered.length; i++) {
      const q = ordered[i],
        slot = questions[i],
        printedNo = slot.no,
        original = key[nos.indexOf(q.no)];
      let unit = input.content.slice(q.start, q.end);
      let next = {
        ...original,
        label: String(printedNo),
        steps: original.steps?.map((s) => ({ ...s })),
      };
      const map: BuiltVariant["mapping"][number] = {
        sourceNo: q.no,
        printedNo,
      };
      const recipe = recipes.find((r) => r.questionNo === q.no);
      let opts = q.options;
      if (recipe) {
        if (!/^Câu\s+\d+\s*[.:)]/iu.test(text(parseFragment(unit)).trim()))
          fail(
            `Câu ${q.no} có ngữ cảnh chung; không thay bằng mẫu số liệu khi chưa tách ngữ cảnh.`,
          );
        const generated = generateRecipe(
          recipe.recipeId,
          Math.floor(random() * recipeDomainSize(recipe.recipeId)),
          printedNo,
        );
        unit = generated.html;
        next = { ...next, answer: generated.answer };
        map.recipe = generated.provenance; // Proof is teacher-only metadata, never append solution to student HTML.
        opts = parse(unit)[0].options;
      }
      const changes: Patch[] = [];
      if (!recipe)
        changes.push({
          start: q.label.start - q.start,
          end: q.label.end - q.start,
          text: String(printedNo),
        });
      if (
        input.shuffleOptions &&
        rubric.questions.find((x) => x.no === q.no)?.type === "mc"
      ) {
        const pinned = q.dependent || input.pinnedOptionNos?.includes(q.no);
        if (!opts && !pinned)
          fail(
            `Câu ${q.no} chưa có đúng bốn lựa chọn A–D ở các ô .doc-grid riêng.`,
          );
        if (opts && !pinned) {
          const order = shuffled([0, 1, 2, 3], random);
          map.optionOrder = order.map((j) => "ABCD"[j]);
          next.answer = "ABCD"[
            order.indexOf("ABCD".indexOf(next.answer.toUpperCase()))
          ];
          if (!next.answer) fail(`Đáp án câu ${q.no} không ánh xạ được.`);
          for (let j = 0; j < 4; j++) {
            const src = opts[order[j]],
              dest = opts[j],
              base = recipe ? 0 : q.start;
            let cell = unit.slice(src.start - base, src.end - base);
            cell = patch(cell, [
              {
                start: src.label.start - src.start,
                end: src.label.end - src.start,
                text: "ABCD"[j],
              },
            ]);
            changes.push({
              start: dest.start - base,
              end: dest.end - base,
              text: cell,
            });
          }
        }
      }
      unit = patch(unit, changes);
      replacements.push({ start: slot.start, end: slot.end, text: unit });
      mapping.push(map);
      answerKey.push(next);
    }
    const nextRubric = normalizeRubric(rubricFromAnswerKey(answerKey));
    if (nextRubric.totalPoints !== rubric.totalPoints)
      fail("Tổng điểm thay đổi khi ánh xạ.");
    return {
      code,
      examHtml: patch(input.content, replacements),
      answerKey,
      rubric: nextRubric,
      mapping,
    };
  });
  for (let i = 0; i < variants.length; i++)
    if (
      variants
        .slice(0, i)
        .some(
          (v) =>
            v.examHtml === variants[i].examHtml &&
            JSON.stringify(v.answerKey) ===
              JSON.stringify(variants[i].answerKey),
        )
    )
      warnings.push(
        `Mã ${variants[i].code} trùng hoán vị hiệu dụng với một mã trước; hãy đổi hạt giống hoặc giảm số mã.`,
      );
  return {
    algorithmVersion: 1,
    warnings,
    variants,
    questions: questions.map((q) => ({
      no: q.no,
      label: `Câu ${q.no}`,
      canShuffleOptions:
        !!q.options && !q.dependent && !input.pinnedOptionNos?.includes(q.no),
      warnings: q.dependent
        ? ["Ghim đáp án vì có tham chiếu thứ tự/phương án/câu khác."]
        : !q.options
          ? ["Chưa xác minh được cấu trúc bốn lựa chọn riêng."]
          : [],
    })),
  };
}
