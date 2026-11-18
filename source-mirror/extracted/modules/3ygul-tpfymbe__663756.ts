// Reconstructed from 3ygul-tpfymbe.js, module 663756.
// deps: none
// exports: daysUntil, estimatedTurns, formatDate, formatPoints, formatVnd, lotSourceLabel, orderStatusLabel, packageBonusPercent, parseAmountInput, promoUntil, topupQuote
export { function(e,t=Date.now()){return Math.max(0,Math.ceil((new Date(e).getTime()-t)/864e5))} as "daysUntil" };
export { function(e){return Math.max(1,Math.round(e/2e3))} as "estimatedTurns" };
export { function(e){return new Date(e).toLocaleDateString("vi-VN",{day:"2-digit",month:"2-digit",year:"numeric",timeZone:"Asia/Ho_Chi_Minh"})} as "formatDate" };
export { function(e){return e.toLocaleString("vi-VN")} as "formatPoints" };
export { function(e){return`${e.toLocaleString("vi-VN")}đ`} as "formatVnd" };
export { function(e){switch(e){case"package":return"Gói tháng";case"topup":return"Nạp lẻ";case"promo":return"Thưởng khuyến mãi";case"reward":return"Thưởng nhiệm vụ";case"initial":return"Điểm tặng ban đầu";case"adjustment":return"Quản trị viên cộng";case"legacy":return"Điểm hiện có";default:return"Điểm"}} as "lotSourceLabel" };
export { function(e){switch(e){case"pending":return"Đang chờ";case"paid":return"Thành công";case"expired":return"Hết hạn";case"cancelled":return"Đã huỷ";default:return e}} as "orderStatusLabel" };
export { function(e,t){let n=t.reduce((e,t)=>!e||t.priceVnd<e.priceVnd?t:e,null);return n&&n.id!==e.id?Math.round((e.points/e.priceVnd/(n.points/n.priceVnd)-1)*100):0} as "packageBonusPercent" };
export { function(e){let t=e.replace(/\D/g,"").slice(0,9);return t?Number(t):0} as "parseAmountInput" };
export { function(e,t){if(!e)return"";let[n,r=""]=e.split("T"),a=n===t?"hôm nay":`ng\xe0y ${n.slice(8,10)}/${n.slice(5,7)}`;if("23:59:59"===r)return`đến hết ${a}`;let i=r.endsWith(":00")?r.slice(0,5):r;return`đến ${i} ${a}`} as "promoUntil" };
export { function(e,t){let n=Math.floor(t*e.topupPointsPer1000/1e3),r=e.promo?.percent??0,a=Math.floor(n*r/100);return{base:n,bonus:a,total:n+a,percent:r}} as "topupQuote" };

"use strict";
