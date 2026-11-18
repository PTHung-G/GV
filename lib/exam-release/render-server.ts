import { parseFragment, serialize } from 'parse5';
import { renderMathInHtml } from '@/lib/math';
const passiveTags=new Set('p div span br h1 h2 h3 h4 h5 h6 strong b em i u s sub sup ul ol li table thead tbody tfoot tr th td colgroup col blockquote hr figure figcaption img math semantics mrow mi mn mo mtext mspace mfrac msqrt mroot msup msub msubsup mover munder munderover mtable mtr mtd annotation menclose mpadded mstyle svg g path line polyline polygon rect circle ellipse text tspan defs marker clippath'.split(' '));
const passiveAttrs=new Set('class id style colspan rowspan width height alt display mathvariant encoding columnalign rowspacing columnspacing stretchy fence separator accent accentunder notation scriptlevel data-page-break data-columns viewbox xmlns d x y x1 y1 x2 y2 cx cy r rx ry points fill stroke stroke-width stroke-dasharray stroke-linecap stroke-linejoin transform text-anchor dominant-baseline markerwidth markerheight refx refy orient markerunits preserveaspectratio'.split(' '));
const styles=new Set('text-align font-size font-family font-weight font-style text-decoration line-height vertical-align grid-template-columns column-gap row-gap --header-columns --header-space-after --header-line-height --header-column-gap'.split(' '));
export function sanitizeReleaseHtml(html:string) {
 const fragment=parseFragment(renderMathInHtml(html));
 const walk=(node:any)=>{
  if(node.childNodes)node.childNodes=node.childNodes.filter((child:any)=>!child.tagName||passiveTags.has(child.tagName.toLowerCase()));
  for(const child of node.childNodes??[]){
   if(child.attrs)child.attrs=child.attrs.filter((attr:any)=>{
    if(attr.name==='src'&&child.tagName==='img')return /^data:image\/(png|jpeg|gif|webp);base64,/i.test(attr.value)||(/^\/(?!\/)/.test(attr.value)&&!/[<>\\]/.test(attr.value));
    return passiveAttrs.has(attr.name.toLowerCase());
   }).map((attr:any)=>attr.name==='style'?{...attr,value:attr.value.split(';').filter((decl:string)=>{const index=decl.indexOf(':');return index>0&&styles.has(decl.slice(0,index).trim())&&!/url\s*\(|expression|[<>@\\]/i.test(decl.slice(index+1));}).join(';')}:attr);
   walk(child);
  }
 };walk(fragment);return serialize(fragment);
}
export const escapeHtml=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
export function releaseArtifact(title:string,code:string,releaseId:string,content:string) {
 return `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${escapeHtml(title)} — ${escapeHtml(code)}</title><style>@page{size:A4;margin:18mm 16mm}*{box-sizing:border-box}body{margin:0;color:#000;background:white;font:13pt/1.5 'Times New Roman',serif}h1{text-align:center;font-size:18pt}h2{font-size:15pt}h3{font-size:14pt}p{margin:.35em 0}img,svg{max-width:100%;max-height:240mm}table{border-collapse:collapse;width:100%}td,th{border:1px solid #777;padding:4px 8px}tr,figure,.doc-grid{break-inside:avoid}.doc-header{display:grid;grid-template-columns:var(--header-columns,1fr 1.4fr)}.doc-header-col{text-align:center}.doc-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.doc-grid[data-columns='2']{grid-template-columns:repeat(2,minmax(0,1fr))}.doc-math-display{display:block;text-align:center}.page-break,[data-page-break]{break-after:page}.release-identity{border-bottom:1px solid #777;font:10pt Arial;padding-bottom:6px;margin-bottom:12px}@media screen{body{max-width:210mm;padding:18mm 16mm;margin:auto}}</style></head><body><div class="release-identity">Mã đề: <b>${escapeHtml(code)}</b> · Bộ in: ${releaseId}</div>${sanitizeReleaseHtml(content)}</body></html>`;
}
