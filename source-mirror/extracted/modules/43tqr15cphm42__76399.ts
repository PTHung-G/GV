// Reconstructed from 43tqr15cphm42.js, module 76399.
// deps: m10552
// exports: Text, default, Underline, default
export { n as "Text" };
export { n as "default" };
export { r as "Underline" };
export { r as "default" };

"use strict";var t=m10552;let n=t.Node.create({name:"text",group:"inline",parseMarkdown:e=>({type:"text",text:e.text||""}),renderMarkdown:e=>e.text||""});;let r=t.Mark.create({name:"underline",addOptions:()=>({HTMLAttributes:{}}),parseHTML:()=>[{tag:"u"},{style:"text-decoration",consuming:!1,getAttrs:e=>!!e.includes("underline")&&{}}],renderHTML({HTMLAttributes:e}){return["u",(0,t.mergeAttributes)(this.options.HTMLAttributes,e),0]},parseMarkdown(e,t){return t.applyMark(this.name||"underline",t.parseInline(e.tokens||[]))},renderMarkdown:(e,t)=>`++${t.renderChildren(e)}++`,markdownTokenizer:{name:"underline",level:"inline",start:e=>e.indexOf("++"),tokenize(e,t,n){let r=/^(\+\+)([\s\S]+?)(\+\+)/.exec(e);if(!r)return;let i=r[2].trim();return{type:"underline",raw:r[0],text:i,tokens:n.inlineTokens(i)}}},addCommands(){return{setUnderline:()=>({commands:e})=>e.setMark(this.name),toggleUnderline:()=>({commands:e})=>e.toggleMark(this.name),unsetUnderline:()=>({commands:e})=>e.unsetMark(this.name)}},addKeyboardShortcuts(){return{"Mod-u":()=>this.editor.commands.toggleUnderline(),"Mod-U":()=>this.editor.commands.toggleUnderline()}}});
