import type { RecipeId, RecipeProvenance } from "./types";
export type GeneratedRecipe = {
  html: string;
  answer: "A";
  explanation: string;
  provenance: RecipeProvenance;
  values: string[];
};
export const RECIPE_IDS: RecipeId[] = [
  "square-root",
  "linear-equation",
  "rational-addition",
];
export function recipeDomainSize(id: RecipeId): number {
  if (id === "square-root") return 19;
  if (id === "linear-equation") return 63;
  if (id === "rational-addition") return 100;
  throw new Error("Mẫu số liệu không được hỗ trợ.");
}
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));
function fraction(n: number, d: number): string {
  const g = gcd(n, d);
  return d / g === 1 ? String(n / g) : `${n / g}/${d / g}`;
}
/** Finite complete domains; each index uniquely describes an explicitly replaced MC template. */
export function generateRecipe(
  id: RecipeId,
  index: number,
  no: number,
): GeneratedRecipe {
  const size = recipeDomainSize(id);
  if (!Number.isInteger(index) || index < 0 || index >= size)
    throw new Error("Tham số mẫu số liệu ngoài miền đã kiểm chứng.");
  let statement: string,
    explanation: string,
    values: string[],
    params: Record<string, number>;
  if (id === "square-root") {
    const root = index + 2;
    params = { root, radicand: root * root };
    statement = `Căn bậc hai số học của $${root * root}$ là`;
    values = [
      String(root),
      String(-root),
      String(root * root),
      String(root + 1),
    ];
    explanation = `Vì $${root}^2=${root * root}$ và $${root}>0$, căn bậc hai số học là $${root}$.`;
    if (root * root !== params.radicand || root <= 0)
      throw new Error("Không xác minh được căn bậc hai.");
  } else if (id === "linear-equation") {
    const a = 2 + (index % 7),
      x = Math.floor(index / 7) - 4,
      b = 3;
    params = { a, x, b, c: a * x + b };
    statement = `Nghiệm của phương trình $${a}x+${b}=${params.c}$ là`;
    values = [String(x), String(x + 1), String(x - 1), String(x + 2)];
    explanation = `$x=(${params.c}-${b})/${a}=${x}$.`;
    if (a * x + b !== params.c)
      throw new Error("Không xác minh được phương trình.");
  } else {
    const a = 1 + (index % 10),
      b = 1 + Math.floor(index / 10),
      d = 11;
    params = { a, b, d };
    statement = `Tính $\\dfrac{${a}}{${d}}+\\dfrac{${b}}{${d}}$.`;
    values = [
      fraction(a + b, d),
      fraction(a + b + 1, d),
      fraction(a + b + 2, d),
      fraction(a + b + 3, d),
    ];
    explanation = `Cùng mẫu số: $\\dfrac{${a}+${b}}{${d}}=\\dfrac{${a + b}}{${d}}$.`;
    if (d <= 0 || a + b <= 0) throw new Error("Không xác minh được phân số.");
  }
  if (new Set(values).size !== 4)
    throw new Error("Mẫu số liệu có đáp án trùng.");
  const html = `<p><b>Câu ${no}.</b> ${statement}</p><div class="doc-grid" data-columns="4">${values.map((v, i) => `<div class="doc-grid-cell"><p>${"ABCD"[i]}. $${v}$</p></div>`).join("")}</div>`;
  return {
    html,
    answer: "A",
    values,
    explanation,
    provenance: { id, version: 1, params, verified: true, explanation },
  };
}
