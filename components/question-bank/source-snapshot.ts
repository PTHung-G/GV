import type { SourceBlock } from "@/lib/question-bank/types";

const VOID = new Set(
  "area base br col embed hr img input link meta param source track wbr".split(
    " ",
  ),
);

/** Exact UTF-16 ranges in the supplied serialization, never node.outerHTML offsets.
 * Canonicalize with snapshotSource first when input is arbitrary editor HTML. */
export function splitSourceBlocks(rawHtml: string): SourceBlock[] {
  const ranges: Array<[number, number]> = [];
  const stack: string[] = [];
  let start = 0;
  let i = 0;
  const emit = (end: number) => {
    if (end > start) ranges.push([start, end]);
    start = end;
  };
  while (i < rawHtml.length) {
    if (
      stack.length &&
      /^(script|style|textarea|title)$/i.test(stack[stack.length - 1])
    ) {
      const name = stack[stack.length - 1];
      const match = new RegExp(`</${name}\\s*>`, "ig");
      match.lastIndex = i;
      const end = match.exec(rawHtml);
      if (!end) {
        i = rawHtml.length;
        break;
      }
      i = end.index;
    }
    if (rawHtml[i] !== "<") {
      i++;
      continue;
    }
    if (rawHtml.startsWith("<!--", i)) {
      if (!stack.length) emit(i);
      const end = rawHtml.indexOf("-->", i + 4);
      i = end < 0 ? rawHtml.length : end + 3;
      if (!stack.length) emit(i);
      continue;
    }
    const token = /^<\/?([a-zA-Z][\w:.-]*)\b/.exec(rawHtml.slice(i));
    if (!token) {
      i++;
      continue;
    }
    if (!stack.length) emit(i);
    let j = i + token[0].length;
    let quote = "";
    for (; j < rawHtml.length; j++) {
      const ch = rawHtml[j];
      if (quote) {
        if (ch === quote) quote = "";
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === ">") break;
    }
    if (j === rawHtml.length) {
      i = j;
      break;
    }
    const name = token[1].toLowerCase();
    const closing = rawHtml[i + 1] === "/";
    const svg = stack.includes("svg");
    if (closing) {
      if (stack[stack.length - 1] !== name)
        throw new Error("Cấu trúc HTML chưa hoàn chỉnh; hãy kiểm tra lại đề.");
      stack.pop();
    } else if (!(rawHtml[j - 1] === "/" || (!svg && VOID.has(name))))
      stack.push(name);
    i = j + 1;
    if (!stack.length) emit(i);
  }
  if (stack.length)
    throw new Error("Cấu trúc HTML chưa hoàn chỉnh; hãy kiểm tra lại đề.");
  emit(rawHtml.length);
  return ranges.map(([start, end]) => {
    const html = rawHtml.slice(start, end);
    const template = document.createElement("template");
    template.innerHTML = html;
    return { start, end, html, text: template.content.textContent ?? "" };
  });
}

export function snapshotSource(html: string): {
  rawHtml: string;
  blocks: SourceBlock[];
} {
  const template = document.createElement("template");
  template.innerHTML = html;
  const rawHtml = template.innerHTML;
  return { rawHtml, blocks: splitSourceBlocks(rawHtml) };
}

export function sourceFragment(
  source: { blocks: SourceBlock[] },
  ids: number[],
): string {
  return [...new Set(ids)]
    .sort((a, b) => a - b)
    .map((id) => source.blocks[id]?.html ?? "")
    .join("");
}
