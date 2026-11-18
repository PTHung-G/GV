// Reconstructed from 0arlwmr2oo6mr.js, module 519159.
// deps: none
// exports: FORMAT_LABELS, KIND_FILTERS, KIND_LABELS, STEPS, checkFile, contentSummary, isProcessing, kindLabel, matchesSearch, progressLabel, progressPercent, stepIndex, uploadBatches
export { {pdf:"PDF",docx:"WORD",doc:"WORD",pptx:"PPT",odt:"ODT",epub:"EPUB",xlsx:"EXCEL",csv:"CSV",text:"TXT",image:"ẢNH"} as "FORMAT_LABELS" };
export { [{value:"all",label:"Tất cả"},{value:"exam",label:"Đề thi"},{value:"matrix",label:"Ma trận"},{value:"spec",label:"Đặc tả"},{value:"answer",label:"Đáp án"},{value:"ref",label:"Tham khảo"}] as "KIND_FILTERS" };
export { t as "KIND_LABELS" };
export { n as "STEPS" };
export { function(e,t,n){let a=e.name.lastIndexOf("."),s=a>=0?e.name.slice(a).toLowerCase():"";return".xls"===s?`“${e.name}”: h\xe3y lưu Excel .xls th\xe0nh .xlsx rồi tải lại.`:".ppt"===s?`“${e.name}”: h\xe3y lưu PowerPoint .ppt th\xe0nh .pptx rồi tải lại.`:t.split(",").includes(s)?e.size>n?`“${e.name}” lớn hơn ${Math.round(n/1024/1024)} MB.`:0===e.size?`“${e.name}” kh\xf4ng c\xf3 nội dung.`:null:`“${e.name}” chưa được hỗ trợ. Kho nhận PDF, Word, PowerPoint, Excel, CSV, ảnh v\xe0 tệp văn bản.`} as "checkFile" };
export { function(e){if("ready"!==e.status)return"";let t=[];if(e.pageCount>0){let n="xlsx"===e.format?"sheet":"image"===e.format?"ảnh":"pptx"===e.format?"slide":"trang";t.push(e.truncated?`${e.pageCount} ${n} đầu`:`${e.pageCount} ${n}`)}return e.figureCount>0&&t.push(`${e.figureCount} h\xecnh`),t.join(" · ")} as "contentSummary" };
export { function(e){return"queued"===e.status||"processing"===e.status} as "isProcessing" };
export { function(e,n=!1){return e&&e in t?t[e]:n?"Đang nhận diện":"Chưa phân loại"} as "kindLabel" };
export { function(e,t){let n=s(t.trim());return!n||s(`${e.name} ${e.subject} ${e.examType} ${e.summary}`).includes(n)} as "matchesSearch" };
export { function(e){if("queued"===e.status)return"Đang chờ đọc";let t=n[a(e)]??"Đang xử lý",{done:s,total:i}=e.progress??{};return e.progress?.step==="spelling"?"Soát chính tả":i&&i>0?`${t} ${s??0}/${i}`:t} as "progressLabel" };
export { function(e){if("ready"===e.status)return 100;let t=a(e),{done:s,total:i}=e.progress??{};return Math.round((t+(i&&i>0?Math.min(1,(s??0)/i):.3))/n.length*100)} as "progressPercent" };
export { a as "stepIndex" };
export { function(e,t){let n=e.filter(e=>r(e.name)),a=e.filter(e=>!r(e.name)).map(e=>[e]);for(let e=0;e<n.length;e+=t)a.push(n.slice(e,e+t));return a} as "uploadBatches" };

"use strict";let t={exam:"Đề thi",matrix:"Ma trận",spec:"Bản đặc tả",answer:"Đáp án",ref:"Tham khảo",other:"Khác"},n=["Tải lên","Đọc tài liệu","Phân tích hình","Tóm tắt"];function a(e){if("ready"===e.status)return n.length;if("queued"===e.status||!e.progress?.step)return 1;switch(e.progress.step){case"extract":break;case"spelling":case"figures":return 2;case"analyze":return 3}return 1}function s(e){return e.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/gi,"d").toLowerCase()}let i=[".jpg",".jpeg",".png",".webp"];function r(e){let t=e.toLowerCase();return i.some(e=>t.endsWith(e))}
