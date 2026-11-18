/**
 * Figure specifications.
 *
 * The assistant never draws. It picks one of these shapes and fills in the
 * numbers; `solve()` turns that into exact coordinates, and only then is
 * anything rendered. That split is what makes a figure checkable: a right angle
 * either is one, or the spec is rejected.
 */

export const FIGURE_KINDS = [
  'triangle-right',
  'triangle-sides',
  'circle-tangents',
  'parabola',
] as const;

export type FigureKind = (typeof FIGURE_KINDS)[number];

export type FigureSpec = {
  kind: FigureKind;
  /** Numbers in centimetres or, for a parabola, plain coefficients. */
  params: Record<string, number | boolean>;
  /** Shown under the drawing, e.g. "Hình 1". Optional. */
  caption?: string;
};

export type Point = { name: string; x: number; y: number; label?: string };

/** Eight compass positions, plus the middle ones; matches TikZ anchor names. */
export type Anchor =
  | 'above'
  | 'below'
  | 'left'
  | 'right'
  | 'above left'
  | 'above right'
  | 'below left'
  | 'below right';

export type LabelAt = { name: string; anchor: Anchor; text?: string };

export type RightAngle = { at: string; from: string; to: string; size?: number };

export type Scene = {
  points: Record<string, { x: number; y: number }>;
  labels: LabelAt[];
  segments: Array<[string, string]>;
  /** Dashed segments: auxiliary lines such as an altitude. */
  dashed: Array<[string, string]>;
  circles: Array<{ center: string; radius: number }>;
  rightAngles: RightAngle[];
  /** Free polylines, already in TikZ units. */
  polylines: Array<{ points: Array<[number, number]> }>;
  axes: { xRange: [number, number]; yAt: number } | null;
};

export class FigureError extends Error {
  constructor(
    message: string,
    readonly reason: string,
  ) {
    super(message);
    this.name = 'FigureError';
  }
}

const num = (params: Record<string, unknown>, key: string): number => {
  const raw = params[key];
  const value = typeof raw === 'string' ? Number(raw.replace(',', '.')) : Number(raw);
  if (!Number.isFinite(value)) {
    throw new FigureError(`Thiếu hoặc sai số đo "${key}".`, 'bad_param');
  }
  return value;
};

/** Rejects zero and negative lengths before they reach the renderer. */
const length = (params: Record<string, unknown>, key: string): number => {
  const value = num(params, key);
  if (value <= 0) throw new FigureError(`Độ dài "${key}" phải lớn hơn 0.`, 'bad_length');
  return value;
};

export function solve(spec: FigureSpec): Scene {
  switch (spec.kind) {
    case 'triangle-right':
      return triangleRight(spec.params);
    case 'triangle-sides':
      return triangleSides(spec.params);
    case 'circle-tangents':
      return circleTangents(spec.params);
    case 'parabola':
      return parabola(spec.params);
    default:
      throw new FigureError(`Chưa hỗ trợ loại hình "${String(spec.kind)}".`, 'unknown_kind');
  }
}

/**
 * Tam giác ABC vuông tại A.
 *
 * AB and AC are the legs; the altitude from A to BC is optional. Everything —
 * including the foot H — is computed here, never guessed by the renderer.
 */
function triangleRight(params: Record<string, unknown>): Scene {
  const ab = length(params, 'ab');
  const ac = length(params, 'ac');
  const withAltitude = params.altitude === true || params.altitude === 'true';

  const A = { x: 0, y: 0 };
  const B = { x: ab, y: 0 };
  const C = { x: 0, y: ac };

  const points: Scene['points'] = { A, B, C };
  const labels: LabelAt[] = [
    { name: 'A', anchor: 'below left' },
    { name: 'B', anchor: 'below right' },
    { name: 'C', anchor: 'above left' },
  ];
  const segments: Array<[string, string]> = [
    ['A', 'B'],
    ['B', 'C'],
    ['C', 'A'],
  ];
  const dashed: Array<[string, string]> = [];
  const rightAngles: RightAngle[] = [{ at: 'A', from: 'B', to: 'C' }];

  if (withAltitude) {
    // Foot of the perpendicular from A onto BC.
    const bcx = C.x - B.x;
    const bcy = C.y - B.y;
    const t = ((A.x - B.x) * bcx + (A.y - B.y) * bcy) / (bcx * bcx + bcy * bcy);
    if (t <= 0 || t >= 1) {
      throw new FigureError(
        'Chân đường cao rơi ra ngoài đoạn BC nên không dựng được hình này.',
        'altitude_outside',
      );
    }
    const H = { x: B.x + t * bcx, y: B.y + t * bcy };
    points.H = H;
    labels.push({ name: 'H', anchor: 'above right' });
    dashed.push(['A', 'H']);
    rightAngles.push({ at: 'H', from: 'A', to: 'C', size: 0.28 });
  }

  return {
    points,
    labels,
    segments,
    dashed,
    circles: [],
    rightAngles,
    polylines: [],
    axes: null,
  };
}

/**
 * Tam giác biết ba cạnh (a = BC, b = CA, c = AB).
 *
 * The three lengths must satisfy the triangle inequality; if they do not, no
 * drawing is produced at all rather than an impossible one.
 */
function triangleSides(params: Record<string, unknown>): Scene {
  const a = length(params, 'a');
  const b = length(params, 'b');
  const c = length(params, 'c');

  const violations: string[] = [];
  if (b + c <= a) violations.push(`b + c = ${(b + c).toFixed(2)} ≤ a = ${a}`);
  if (a + c <= b) violations.push(`a + c = ${(a + c).toFixed(2)} ≤ b = ${b}`);
  if (a + b <= c) violations.push(`a + b = ${(a + b).toFixed(2)} ≤ c = ${c}`);
  if (violations.length) {
    throw new FigureError(
      `Ba cạnh không tạo thành tam giác (${violations.join('; ')}).`,
      'triangle_inequality',
    );
  }

  const A = { x: 0, y: 0 };
  const B = { x: c, y: 0 };
  const x = (b * b + c * c - a * a) / (2 * c);
  const y = Math.sqrt(Math.max(b * b - x * x, 0));
  const C = { x, y };

  return {
    points: { A, B, C },
    labels: [
      { name: 'A', anchor: 'below left' },
      { name: 'B', anchor: 'below right' },
      { name: 'C', anchor: 'above' },
    ],
    segments: [
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'A'],
    ],
    dashed: [],
    circles: [],
    rightAngles: [],
    polylines: [],
    axes: null,
  };
}

/**
 * Hai tiếp tuyến kẻ từ A tới đường tròn (O; R).
 *
 * Requires A to be strictly outside the circle. The tangent points are solved
 * analytically, so the right angles at B and C are true by construction.
 */
function circleTangents(params: Record<string, unknown>): Scene {
  const r = length(params, 'r');
  const d = length(params, 'd');

  if (d <= r) {
    throw new FigureError(
      `Điểm A cách tâm ${d} nhưng bán kính là ${r}: A nằm trong hoặc trên đường tròn nên không có tiếp tuyến.`,
      'point_inside_circle',
    );
  }

  const O = { x: 0, y: 0 };
  const A = { x: d, y: 0 };
  const x = (r * r) / d;
  const y = (r * Math.sqrt(d * d - r * r)) / d;
  const B = { x, y };
  const C = { x, y: -y };

  return {
    points: { O, A, B, C },
    labels: [
      { name: 'O', anchor: 'left' },
      { name: 'A', anchor: 'right' },
      { name: 'B', anchor: 'above right' },
      { name: 'C', anchor: 'below right' },
    ],
    segments: [
      ['A', 'B'],
      ['A', 'C'],
      ['O', 'B'],
      ['O', 'C'],
    ],
    dashed: [],
    circles: [{ center: 'O', radius: r }],
    rightAngles: [
      { at: 'B', from: 'A', to: 'O', size: 0.26 },
      { at: 'C', from: 'A', to: 'O', size: 0.26 },
    ],
    polylines: [],
    axes: null,
  };
}

/**
 * Đồ thị y = ax² + bx + c.
 *
 * The curve is sampled here, so the vertex and the axis ranges are known values
 * rather than something TeX decided.
 */
function parabola(params: Record<string, unknown>): Scene {
  const a = num(params, 'a');
  const b = num(params, 'b');
  const c = num(params, 'c');

  if (a === 0) {
    throw new FigureError('Hệ số a phải khác 0 thì mới là parabol.', 'not_parabola');
  }

  const vertexX = -b / (2 * a);
  const vertexY = a * vertexX * vertexX + b * vertexX + c;

  // The domain is chosen so the drawing stays roughly square.
  //
  // Over [x0 - s, x0 + s] the curve is 2s wide and |a|s² tall, so a steep or
  // wide-sampled parabola becomes a thin streak tens of centimetres long — far
  // taller than an A4 page. Capping |a|s² at 4s keeps height ≈ width.
  const requested = Number(params.span);
  const wanted = Number.isFinite(requested) && requested > 0 ? requested : 2;
  const halfSpan = Math.max(0.5, Math.min(wanted, 4 / Math.abs(a)));

  const xMin = vertexX - halfSpan;
  const xMax = vertexX + halfSpan;

  // Sample the curve densely; the polyline is visually smooth at print size.
  const samples = 97;
  const curve: Array<[number, number]> = [];
  for (let i = 0; i < samples; i += 1) {
    const x = xMin + ((xMax - xMin) * i) / (samples - 1);
    curve.push([x, a * x * x + b * x + c]);
  }

  // Axes span enough to contain both the curve and the origin.
  const ys = curve.map(([, y]) => y);
  const yLo = Math.min(...ys, 0);
  const yHi = Math.max(...ys, 0);
  const xLo = Math.min(xMin, 0);
  const xHi = Math.max(xMax, 0);

  return {
    points: { V: { x: vertexX, y: vertexY }, O: { x: 0, y: 0 } },
    labels: [],
    segments: [],
    dashed: [],
    circles: [],
    rightAngles: [],
    polylines: [{ points: curve }],
    axes: { xRange: [xLo, xHi], yAt: Math.min(Math.max(0, yLo), yHi) },
  };
}

/** Human-readable description of a kind, used by the insert dialog. */
export const FIGURE_META: Record<
  FigureKind,
  { label: string; description: string; fields: Array<{ key: string; label: string; def: number }> }
> = {
  'triangle-right': {
    label: 'Tam giác vuông',
    description: 'Tam giác ABC vuông tại A, có thể kèm đường cao AH.',
    fields: [
      { key: 'ab', label: 'AB (cm)', def: 6 },
      { key: 'ac', label: 'AC (cm)', def: 8 },
    ],
  },
  'triangle-sides': {
    label: 'Tam giác biết ba cạnh',
    description: 'Dựng tam giác từ độ dài ba cạnh (a = BC, b = CA, c = AB).',
    fields: [
      { key: 'a', label: 'a = BC', def: 5 },
      { key: 'b', label: 'b = CA', def: 6 },
      { key: 'c', label: 'c = AB', def: 7 },
    ],
  },
  'circle-tangents': {
    label: 'Hai tiếp tuyến',
    description: 'Hai tiếp tuyến kẻ từ điểm A nằm ngoài đường tròn (O; R).',
    fields: [
      { key: 'r', label: 'Bán kính R', def: 2 },
      { key: 'd', label: 'Khoảng cách OA', def: 4 },
    ],
  },
  parabola: {
    label: 'Parabol',
    description: 'Đồ thị hàm số y = ax² + bx + c cùng hệ trục.',
    fields: [
      { key: 'a', label: 'a', def: 1 },
      { key: 'b', label: 'b', def: 0 },
      { key: 'c', label: 'c', def: 0 },
    ],
  },
};
