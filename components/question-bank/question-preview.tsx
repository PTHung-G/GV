"use client";

import { useEffect, useState } from "react";
import { renderMathInHtml } from "@/lib/math";

const TAGS = new Set(
  "p div span a br hr h1 h2 h3 h4 h5 h6 b strong i em u s sub sup ul ol li table thead tbody tfoot tr td th caption colgroup col blockquote pre code figure figcaption img svg g use symbol path circle ellipse rect line polyline polygon text tspan defs marker clipPath mask linearGradient radialGradient stop math semantics annotation mrow mi mn mo ms mtext mspace msup msub msubsup mfrac msqrt mroot munder mover munderover mtable mtr mtd menclose mpadded mphantom mmultiscripts mprescripts none"
    .toLowerCase()
    .split(" "),
);
const ATTRS = new Set(
  "id class colspan rowspan start width height viewbox d x y x1 x2 y1 y2 cx cy r rx ry points fill fill-rule fill-opacity stroke stroke-width stroke-linecap stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset stroke-opacity opacity transform xmlns preserveaspectratio clip-rule clip-path mask marker-start marker-mid marker-end markerwidth markerheight refx refy orient gradientunits gradienttransform offset stop-color stop-opacity role aria-label display mathvariant mathsize mathcolor encoding columnalign rowspacing columnspacing stretchy fence separator accent accentunder movablelimits linethickness notation alt".split(
    " ",
  ),
);

/** Preview-only transformation. The stored source is never sanitized or rewritten. */
export function buildPreviewDocument(html: string): string {
  const template = document.createElement("template");
  // Parse untrusted content in an inert template first. Rendering math directly in
  // a div could cause detached <img> elements to request external resources.
  template.innerHTML = html;
  for (const el of Array.from(template.content.querySelectorAll("*"))) {
    if (!TAGS.has(el.localName.toLowerCase())) {
      el.remove();
      continue;
    }
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (
        name === "style" &&
        el.namespaceURI === "http://www.w3.org/2000/svg"
      ) {
        // Cairo writes paint in style declarations. Convert only known, URL-free
        // paint properties to SVG presentation attributes; never keep source CSS.
        for (const declaration of attr.value.split(";")) {
          const separator = declaration.indexOf(":");
          const property = declaration.slice(0, separator).trim().toLowerCase();
          const value = declaration.slice(separator + 1).trim();
          if (
            separator > 0 &&
            /^(fill|fill-rule|fill-opacity|stroke|stroke-width|stroke-linecap|stroke-linejoin|stroke-miterlimit|stroke-dasharray|stroke-dashoffset|stroke-opacity|opacity)$/.test(
              property,
            ) &&
            /^[\w\s#.,%()+-]+$/.test(value) &&
            !/url|expression|var/i.test(value)
          )
            el.setAttribute(property, value);
        }
        el.removeAttribute(attr.name);
        continue;
      }
      const rasterData =
        el.localName === "img" &&
        name === "src" &&
        /^data:image\/(png|jpeg|gif|webp);base64,[a-z0-9+/=\s]+$/i.test(
          attr.value,
        );
      const svgElement = el.namespaceURI === "http://www.w3.org/2000/svg";
      const localHref =
        svgElement &&
        el.localName === "use" &&
        (name === "href" || name === "xlink:href") &&
        /^#[a-zA-Z_][\w:.-]*$/.test(attr.value);
      const localPaint =
        svgElement &&
        [
          "clip-path",
          "mask",
          "marker-start",
          "marker-mid",
          "marker-end",
          "fill",
          "stroke",
        ].includes(name) &&
        /^url\(\s*['"]?#[a-zA-Z_][\w:.-]*['"]?\s*\)$/.test(attr.value);
      if (
        (!ATTRS.has(name) && !rasterData && !localHref) ||
        (!localPaint &&
          /url\s*\(|(?:https?:|javascript:|\/\/)/i.test(attr.value))
      )
        el.removeAttribute(attr.name);
    }
  }
  const rendered = renderMathInHtml(template.innerHTML);
  const theme = getComputedStyle(document.documentElement);
  const tokenColor = (name: string, fallback: string) => {
    const value = theme.getPropertyValue(name).trim();
    // Only a validated CSS color may cross into the isolated stylesheet.
    return value && CSS.supports("color", value) && !/[;{}<>]/.test(value)
      ? value
      : fallback;
  };
  const ink = tokenColor("--color-ink", "black");
  const surface = tokenColor("--color-surface", "white");
  const line = tokenColor("--color-line", "silver");
  return `<!doctype html><html lang="vi"><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; font-src 'none'; connect-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'; navigate-to 'none'"><style>body{margin:0;padding:18px;color:${ink};background:${surface};font:15px/1.65 Georgia,'Times New Roman',serif;overflow-wrap:anywhere}img,svg,table{max-width:100%;height:auto}table{border-collapse:collapse}td,th{border:1px solid ${line};padding:5px}figure{margin:12px 0}.doc-math-display{display:block;text-align:center;margin:12px 0}p{margin:6px 0}a{pointer-events:none}math{font-size:1.1em}</style></head><body>${rendered}</body></html>`;
}

export function QuestionPreview({
  html,
  title,
  large = false,
}: {
  html: string;
  title: string;
  large?: boolean;
}) {
  const [srcDoc, setSrcDoc] = useState("");
  useEffect(() => {
    setSrcDoc(buildPreviewDocument(html));
  }, [html]);
  return (
    <iframe
      title={title}
      sandbox=""
      referrerPolicy="no-referrer"
      srcDoc={srcDoc}
      className={`w-full rounded-lg border border-line bg-surface ${large ? "h-[65vh]" : "h-64"}`}
    />
  );
}
