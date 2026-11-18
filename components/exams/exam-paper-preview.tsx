'use client';

/**
 * Miniature A4 render for the library grid.
 *
 * Mirrors the original `exam-paper` thumbnail: a real A4 page (793.7px wide at
 * 15.33px/28.67px type) scaled down with a CSS transform and faded out at the
 * bottom with `doc-thumb-fade`.
 */
export function ExamPaperPreview({ lines, scale = 0.262 }: { lines: string[]; scale?: number }) {
  return (
    <div aria-hidden="true" className="relative h-full w-full overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white select-none">
        <div
          className="doc-thumb-fade origin-top-left"
          style={{
            width: '793.7px',
            paddingTop: '60px',
            paddingLeft: '72px',
            paddingRight: '56px',
            fontFamily: "'Times New Roman', Times, serif",
            fontSize: '15.33px',
            lineHeight: '24px',
            transform: `scale(${scale})`,
            maskImage: 'linear-gradient(to bottom, #000 94%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 94%, transparent 100%)',
          }}
        >
          <div className="text-black">
            {lines.map((line, i) => (
              <p
                key={`${i}-${line.slice(0, 12)}`}
                style={{
                  margin: '0 0 2px',
                  textAlign: i < 5 ? 'center' : undefined,
                  fontWeight: /^[A-ZĐỀÀ-Ỹ\s.…–-]{12,}$/.test(line.trim()) && i < 6 ? 700 : 400,
                }}
              >
                {line}
              </p>
            ))}
            {/* Faint ruler-like filler so short previews still read as a full page. */}
            {lines.length < 26 &&
              Array.from({ length: 26 - lines.length }).map((_, i) => (
                <p key={`filler-${i}`} style={{ margin: '0 0 9px' }}>
                  <span
                    style={{
                      display: 'block',
                      height: '6px',
                      width: `${92 - (i % 4) * 11}%`,
                      background: 'var(--color-surface-3)',
                      borderRadius: 2,
                    }}
                  />
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
