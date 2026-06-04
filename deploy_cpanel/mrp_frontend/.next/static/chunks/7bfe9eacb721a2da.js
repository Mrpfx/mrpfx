(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,10968,e=>{"use strict";let t=(0,e.i(89210).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);e.s(["Send",()=>t],10968)},71001,e=>{"use strict";let t,a;var s,r=e.i(36812);let i={data:""},o=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,l=/\/\*[^]*?\*\/|  +/g,n=/\n+/g,d=(e,t)=>{let a="",s="",r="";for(let i in e){let o=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+o+";":s+="f"==i[1]?d(o,i):i+"{"+d(o,"k"==i[1]?"":t)+"}":"object"==typeof o?s+=d(o,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=o&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=d.p?d.p(i,o):i+":"+o+";")}return a+(t&&r?t+"{"+r+"}":r)+s},c={},p=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+p(e[a]);return t}return e};function m(e){let t,a,s=this||{},r=e.call?e(s.p):e;return((e,t,a,s,r)=>{var i;let m=p(e),u=c[m]||(c[m]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(m));if(!c[u]){let t=m!==e?e:(e=>{let t,a,s=[{}];for(;t=o.exec(e.replace(l,""));)t[4]?s.shift():t[3]?(a=t[3].replace(n," ").trim(),s.unshift(s[0][a]=s[0][a]||{})):s[0][t[1]]=t[2].replace(n," ").trim();return s[0]})(e);c[u]=d(r?{["@keyframes "+u]:t}:t,a?"":"."+u)}let f=a&&c.g?c.g:null;return a&&(c.g=c[u]),i=c[u],f?t.data=t.data.replace(f,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),u})(r.unshift?r.raw?(t=[].slice.call(arguments,1),a=s.p,r.reduce((e,s,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":d(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"")):r.reduce((e,t)=>Object.assign(e,t&&t.call?t(s.p):t),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||i})(s.target),s.g,s.o,s.k)}m.bind({g:1});let u,f,g,x=m.bind({k:1});function h(e,t){let a=this||{};return function(){let s=arguments;function r(i,o){let l=Object.assign({},i),n=l.className||r.className;a.p=Object.assign({theme:f&&f()},l),a.o=/ *go\d+/.test(n),l.className=m.apply(a,s)+(n?" "+n:""),t&&(l.ref=o);let d=e;return e[0]&&(d=l.as||e,delete l.as),g&&d[0]&&g(l),u(d,l)}return t?t(r):r}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),w="default",v=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return v(e,{type:+!!e.toasts.find(e=>e.id===s.id),toast:s});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},j=[],N={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},k={},S=(e,t=w)=>{k[t]=v(k[t]||N,e),j.forEach(([e,a])=>{e===t&&a(k[t])})},E=e=>Object.keys(k).forEach(t=>S(e,t)),$=(e=w)=>t=>{S(t,e)},A=e=>(t,a)=>{let s,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||b()}))(t,e,a);return $(r.toasterId||(s=r.id,Object.keys(k).find(e=>k[e].toasts.some(e=>e.id===s))))({type:2,toast:r}),r.id},F=(e,t)=>A("blank")(e,t);F.error=A("error"),F.success=A("success"),F.loading=A("loading"),F.custom=A("custom"),F.dismiss=(e,t)=>{let a={type:3,toastId:e};t?$(t)(a):E(a)},F.dismissAll=e=>F.dismiss(void 0,e),F.remove=(e,t)=>{let a={type:4,toastId:e};t?$(t)(a):E(a)},F.removeAll=e=>F.remove(void 0,e),F.promise=(e,t,a)=>{let s=F.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?y(t.success,e):void 0;return r?F.success(r,{id:s,...a,...null==a?void 0:a.success}):F.dismiss(s),e}).catch(e=>{let r=t.error?y(t.error,e):void 0;r?F.error(r,{id:s,...a,...null==a?void 0:a.error}):F.dismiss(s)}),e};var C=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,O=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,I=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,M=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${C} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${O} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${I} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,T=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,_=h("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${T} 1s linear infinite;
`,z=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,U=x`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,P=h("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${z} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${U} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,D=h("div")`
  position: absolute;
`,L=h("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,q=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=h("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${q} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,R=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return void 0!==t?"string"==typeof t?r.createElement(H,null,t):t:"blank"===a?null:r.createElement(L,null,r.createElement(_,{...s}),"loading"!==a&&r.createElement(D,null,"error"===a?r.createElement(M,{...s}):r.createElement(P,{...s})))},W=h("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,B=h("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;r.memo(({toast:e,position:t,style:s,children:i})=>{let o=e.height?((e,t)=>{let s=e.includes("top")?1:-1,[r,i]=(()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*s}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*s}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${x(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},l=r.createElement(R,{toast:e}),n=r.createElement(B,{...e.ariaProps},y(e.message,e));return r.createElement(W,{className:e.className,style:{...o,...s,...e.style}},"function"==typeof i?i({icon:l,message:n}):r.createElement(r.Fragment,null,l,n))}),s=r.createElement,d.p=void 0,u=s,f=void 0,g=void 0,m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,e.s(["default",()=>F,"toast",()=>F],71001)},43137,12293,e=>{"use strict";var t=e.i(89210);let a=(0,t.default)("type",[["path",{d:"M12 4v16",key:"1654pz"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",key:"e0r10z"}],["path",{d:"M9 20h6",key:"s66wpe"}]]);e.s(["Type",()=>a],43137);let s=(0,t.default)("text-align-start",[["path",{d:"M21 5H3",key:"1fi0y6"}],["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M17 19H3",key:"z6ezky"}]]);e.s(["AlignLeft",()=>s],12293)},35825,e=>{"use strict";var t=e.i(2609);e.s(["adminService",0,{getUsers:async(e=1,a=10)=>(await t.default.get("/wordpress/users/",{params:{page:e,per_page:a}})).data,getUser:async e=>(await t.default.get(`/wordpress/users/${e}`)).data,getOrders:async(e="any",a=10,s=0)=>(await t.default.get("/wordpress/wc/orders/",{params:{status:e,limit:a,offset:s}})).data,getAllOrders:async(e="any")=>{let a=0,s=[];for(;;){let r=(await t.default.get("/wordpress/wc/orders/",{params:{status:e,limit:100,offset:a}})).data||[];if(s=s.concat(r),r.length<100)break;a+=100}return s},getOrder:async e=>(await t.default.get(`/wordpress/wc/orders/${e}`)).data,getMembers:async(e=1,t=10)=>[],getMember:async e=>(await t.default.get(`/wordpress/members/${e}`)).data,getCourses:async(e=0,a=10)=>(await t.default.get("/wordpress/learnpress/courses",{params:{skip:e,limit:a}})).data,getAllCourses:async()=>{let e=0,a=[];for(;;){let s=(await t.default.get("/wordpress/learnpress/courses",{params:{skip:e,limit:100}})).data||[];if(a=a.concat(s),s.length<100)break;e+=100}return a},getDashboardStats:async()=>{try{let[e,a,s]=await Promise.all([t.default.get("/wordpress/users/",{params:{per_page:1}}),t.default.get("/wordpress/wc/orders/",{params:{limit:1}}),t.default.get("/wordpress/learnpress/courses",{params:{limit:1}})]);return{users:parseInt(e.headers["x-wp-total"]||"0")||e.data.length,orders:parseInt(a.headers["x-wp-total"]||"0")||a.data.length,courses:parseInt(s.headers["x-wp-total"]||"0")||s.data.length,members:0}}catch(e){return console.error("Failed to fetch dashboard stats:",e),{users:0,orders:0,courses:0,members:0}}},getTemplates:async()=>{try{return(await t.default.get("/admin/marketing/templates")).data}catch(e){return console.warn("Using mock email templates",e),[{id:"welcome",name:"Welcome Email",subject:"Welcome to MRPFX",body:"<p>Welcome to our platform!</p>"},{id:"promo",name:"Promotional Offer",subject:"Special Offer Just For You",body:"<p>Here is a special promo for you.</p>"},{id:"update",name:"System Update",subject:"Important System Update",body:"<p>Please note that we have updated our system.</p>"}]}},sendEmail:async e=>(await t.default.post("/admin/marketing/send-email",e)).data}])},52971,e=>{"use strict";var t=e.i(87420),a=e.i(36812),s=e.i(35825),r=e.i(10968),i=e.i(55681),o=e.i(18990),l=e.i(43137),n=e.i(12293),d=e.i(71001);let c=(0,e.i(38725).default)(()=>e.A(72175),{loadableGenerated:{modules:[32226]},ssr:!1});function p(){let[e,p]=(0,a.useState)([]),[m,u]=(0,a.useState)([]),[f,g]=(0,a.useState)("all"),[x,h]=(0,a.useState)([]),[y,b]=(0,a.useState)(""),[w,v]=(0,a.useState)(""),[j,N]=(0,a.useState)(""),[k,S]=(0,a.useState)(!1),[E,$]=(0,a.useState)(!0);(0,a.useEffect)(()=>{(async()=>{try{let[e,t]=await Promise.all([s.adminService.getTemplates(),s.adminService.getUsers(1,100)]);p(e),u(t)}catch(e){console.error("Failed to load initial data:",e),d.default.error("Failed to load templates or users.")}finally{$(!1)}})()},[]);let A=async e=>{if(e.preventDefault(),"specific"===f&&0===x.length)return void d.default.error("Please select at least one user.");if(!w||!j)return void d.default.error("Subject and message are required.");S(!0);try{await s.adminService.sendEmail({targetOption:f,userIds:x,templateId:y,subject:w,message:j}),d.default.success("Email campaign successfully initiated!")}catch(e){console.error("Email send failed:",e),d.default.error("Failed to send email. Please try again.")}finally{S(!1)}};return E?(0,t.jsx)("div",{className:"flex items-center justify-center min-h-[400px]",children:(0,t.jsx)("div",{className:"w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"})}):(0,t.jsxs)("div",{className:"max-w-4xl space-y-6 pb-20",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-white",children:"Email Marketing"}),(0,t.jsx)("p",{className:"text-gray-400 text-sm mt-1",children:"Create and send email campaigns to your users."})]}),(0,t.jsxs)("form",{onSubmit:A,className:"bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-6",children:[(0,t.jsxs)("div",{className:"space-y-3",children:[(0,t.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,t.jsx)(i.Users,{className:"w-4 h-4 text-purple-400"}),"Target Audience"]}),(0,t.jsxs)("div",{className:"flex gap-4",children:[(0,t.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,t.jsx)("input",{type:"radio",name:"targetOption",checked:"all"===f,onChange:()=>g("all"),className:"text-purple-500 focus:ring-purple-500 bg-[#1F2937] border-gray-700"}),(0,t.jsx)("span",{className:"text-gray-300",children:"All Users"})]}),(0,t.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,t.jsx)("input",{type:"radio",name:"targetOption",checked:"specific"===f,onChange:()=>g("specific"),className:"text-purple-500 focus:ring-purple-500 bg-[#1F2937] border-gray-700"}),(0,t.jsx)("span",{className:"text-gray-300",children:"Specific Users"})]})]}),"specific"===f&&(0,t.jsx)("div",{className:"mt-3 max-h-48 overflow-y-auto bg-[#1F2937] border border-gray-700 rounded-lg p-3 custom-scrollbar",children:(0,t.jsxs)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:[m.map(e=>(0,t.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white",children:[(0,t.jsx)("input",{type:"checkbox",checked:x.includes(e.ID),onChange:()=>{var t;return t=e.ID,void h(e=>e.includes(t)?e.filter(e=>e!==t):[...e,t])},className:"rounded text-purple-500 focus:ring-purple-500 bg-[#111827] border-gray-600"}),(0,t.jsx)("span",{className:"truncate",children:e.user_email||e.user_login})]},e.ID)),0===m.length&&(0,t.jsx)("span",{className:"text-gray-500 text-sm",children:"No users found."})]})})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,t.jsx)(o.FileText,{className:"w-4 h-4 text-purple-400"}),"Email Template"]}),(0,t.jsxs)("select",{value:y,onChange:t=>{let a=t.target.value;b(a);let s=e.find(e=>e.id===a);s&&!w&&v(s.subject)},className:"w-full bg-[#1F2937] border border-gray-700 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500",children:[(0,t.jsx)("option",{value:"",children:"-- No Template (Custom Message) --"}),e.map(e=>(0,t.jsx)("option",{value:e.id,children:e.name},e.id))]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,t.jsx)(l.Type,{className:"w-4 h-4 text-purple-400"}),"Subject Line"]}),(0,t.jsx)("input",{type:"text",value:w,onChange:e=>v(e.target.value),placeholder:"e.g. Special Offer Just For You",required:!0,className:"w-full bg-[#1F2937] border border-gray-700 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-500"})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,t.jsx)(n.AlignLeft,{className:"w-4 h-4 text-purple-400"}),"Email Message"]}),(0,t.jsx)("div",{className:"bg-white rounded-lg overflow-hidden [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-gray-900 border border-gray-300",children:(0,t.jsx)(c,{theme:"snow",value:j,onChange:N})}),(0,t.jsxs)("div",{className:"grid grid-cols-2 gap-4 mt-2",children:[(0,t.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,t.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ username }}"})," - User's name"]}),(0,t.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,t.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ login_id }}"})," - Account Login ID"]}),(0,t.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,t.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ platform }}"})," - Trading Platform"]}),(0,t.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,t.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ user_email }}"})," - User's Email"]})]})]}),(0,t.jsx)("div",{className:"pt-4 border-t border-gray-800 flex justify-end",children:(0,t.jsxs)("button",{type:"submit",disabled:k,className:"flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:[k?(0,t.jsx)("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}):(0,t.jsx)(r.Send,{className:"w-4 h-4"}),"Send Campaign"]})})]})]})}e.s(["default",()=>p])}]);