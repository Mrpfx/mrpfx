module.exports=[80825,a=>{"use strict";let b=(0,a.i(28856).default)("send",[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]]);a.s(["Send",()=>b],80825)},71853,a=>{"use strict";let b,c;var d,e=a.i(37072);let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,j=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?j(g,f):f+"{"+j(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=j(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f=/^--/.test(f)?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=j.p?j.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},k={},l=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+l(a[c]);return b}return a};function m(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let m=l(a),n=k[m]||(k[m]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(m));if(!k[n]){let b=m!==a?a:(a=>{let b,c,d=[{}];for(;b=g.exec(a.replace(h,""));)b[4]?d.shift():b[3]?(c=b[3].replace(i," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(i," ").trim();return d[0]})(a);k[n]=j(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&k.g?k.g:null;return c&&(k.g=k[n]),f=k[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":j(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||f,d.g,d.o,d.k)}m.bind({g:1});let n,o,p,q=m.bind({k:1});function r(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:o&&o()},h),c.o=/ *go\d+/.test(i),h.className=m.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),p&&j[0]&&p(h),n(j,h)}return b?b(e):e}}var s=(a,b)=>"function"==typeof a?a(b):a,t=(b=0,()=>(++b).toString()),u="default",v=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return v(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},w=[],x={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},y={},z=(a,b=u)=>{y[b]=v(y[b]||x,a),w.forEach(([a,c])=>{a===b&&c(y[b])})},A=a=>Object.keys(y).forEach(b=>z(a,b)),B=(a=u)=>b=>{z(b,a)},C=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||t()}))(b,a,c);return B(e.toasterId||(d=e.id,Object.keys(y).find(a=>y[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},D=(a,b)=>C("blank")(a,b);D.error=C("error"),D.success=C("success"),D.loading=C("loading"),D.custom=C("custom"),D.dismiss=(a,b)=>{let c={type:3,toastId:a};b?B(b)(c):A(c)},D.dismissAll=a=>D.dismiss(void 0,a),D.remove=(a,b)=>{let c={type:4,toastId:a};b?B(b)(c):A(c)},D.removeAll=a=>D.remove(void 0,a),D.promise=(a,b,c)=>{let d=D.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?s(b.success,a):void 0;return e?D.success(e,{id:d,...c,...null==c?void 0:c.success}):D.dismiss(d),a}).catch(a=>{let e=b.error?s(b.error,a):void 0;e?D.error(e,{id:d,...c,...null==c?void 0:c.error}):D.dismiss(d)}),a};var E=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,F=q`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,G=q`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,H=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${E} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${F} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${G} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,I=q`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,J=r("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${I} 1s linear infinite;
`,K=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,L=q`
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
}`,M=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${K} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${L} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,N=r("div")`
  position: absolute;
`,O=r("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,P=q`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Q=r("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${P} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,R=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?e.createElement(Q,null,b):b:"blank"===c?null:e.createElement(O,null,e.createElement(J,{...d}),"loading"!==c&&e.createElement(N,null,"error"===c?e.createElement(H,{...d}):e.createElement(M,{...d})))},S=r("div")`
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
`,T=r("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;e.memo(({toast:a,position:b,style:d,children:f})=>{let g=a.height?((a,b)=>{let d=a.includes("top")?1:-1,[e,f]=c?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*d}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*d}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${q(e)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${q(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},h=e.createElement(R,{toast:a}),i=e.createElement(T,{...a.ariaProps},s(a.message,a));return e.createElement(S,{className:a.className,style:{...g,...d,...a.style}},"function"==typeof f?f({icon:h,message:i}):e.createElement(e.Fragment,null,h,i))}),d=e.createElement,j.p=void 0,n=d,o=void 0,p=void 0,m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,a.s(["default",()=>D,"toast",()=>D],71853)},74646,37435,a=>{"use strict";var b=a.i(28856);let c=(0,b.default)("type",[["path",{d:"M12 4v16",key:"1654pz"}],["path",{d:"M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2",key:"e0r10z"}],["path",{d:"M9 20h6",key:"s66wpe"}]]);a.s(["Type",()=>c],74646);let d=(0,b.default)("text-align-start",[["path",{d:"M21 5H3",key:"1fi0y6"}],["path",{d:"M15 12H3",key:"6jk70r"}],["path",{d:"M17 19H3",key:"z6ezky"}]]);a.s(["AlignLeft",()=>d],37435)},82330,a=>{"use strict";var b=a.i(23841);a.s(["adminService",0,{getUsers:async(a=1,c=10)=>(await b.default.get("/wordpress/users/",{params:{page:a,per_page:c}})).data,getUser:async a=>(await b.default.get(`/wordpress/users/${a}`)).data,getOrders:async(a="any",c=10,d=0)=>(await b.default.get("/wordpress/wc/orders/",{params:{status:a,limit:c,offset:d}})).data,getAllOrders:async(a="any")=>{let c=0,d=[];for(;;){let e=(await b.default.get("/wordpress/wc/orders/",{params:{status:a,limit:100,offset:c}})).data||[];if(d=d.concat(e),e.length<100)break;c+=100}return d},getOrder:async a=>(await b.default.get(`/wordpress/wc/orders/${a}`)).data,getMembers:async(a=1,b=10)=>[],getMember:async a=>(await b.default.get(`/wordpress/members/${a}`)).data,getCourses:async(a=0,c=10)=>(await b.default.get("/wordpress/learnpress/courses",{params:{skip:a,limit:c}})).data,getAllCourses:async()=>{let a=0,c=[];for(;;){let d=(await b.default.get("/wordpress/learnpress/courses",{params:{skip:a,limit:100}})).data||[];if(c=c.concat(d),d.length<100)break;a+=100}return c},getDashboardStats:async()=>{try{let[a,c,d]=await Promise.all([b.default.get("/wordpress/users/",{params:{per_page:1}}),b.default.get("/wordpress/wc/orders/",{params:{limit:1}}),b.default.get("/wordpress/learnpress/courses",{params:{limit:1}})]);return{users:parseInt(a.headers["x-wp-total"]||"0")||a.data.length,orders:parseInt(c.headers["x-wp-total"]||"0")||c.data.length,courses:parseInt(d.headers["x-wp-total"]||"0")||d.data.length,members:0}}catch(a){return console.error("Failed to fetch dashboard stats:",a),{users:0,orders:0,courses:0,members:0}}},getTemplates:async()=>{try{return(await b.default.get("/admin/marketing/templates")).data}catch(a){return console.warn("Using mock email templates",a),[{id:"welcome",name:"Welcome Email",subject:"Welcome to MRPFX",body:"<p>Welcome to our platform!</p>"},{id:"promo",name:"Promotional Offer",subject:"Special Offer Just For You",body:"<p>Here is a special promo for you.</p>"},{id:"update",name:"System Update",subject:"Important System Update",body:"<p>Please note that we have updated our system.</p>"}]}},sendEmail:async a=>(await b.default.post("/admin/marketing/send-email",a)).data}])},85199,a=>{"use strict";var b=a.i(7962),c=a.i(37072),d=a.i(82330),e=a.i(80825),f=a.i(92149),g=a.i(9333),h=a.i(74646),i=a.i(37435),j=a.i(71853);let k=(0,a.i(79922).default)(async()=>{},{loadableGenerated:{modules:[32226]},ssr:!1});function l(){let[a,l]=(0,c.useState)([]),[m,n]=(0,c.useState)([]),[o,p]=(0,c.useState)("all"),[q,r]=(0,c.useState)([]),[s,t]=(0,c.useState)(""),[u,v]=(0,c.useState)(""),[w,x]=(0,c.useState)(""),[y,z]=(0,c.useState)(!1),[A,B]=(0,c.useState)(!0);(0,c.useEffect)(()=>{(async()=>{try{let[a,b]=await Promise.all([d.adminService.getTemplates(),d.adminService.getUsers(1,100)]);l(a),n(b)}catch(a){console.error("Failed to load initial data:",a),j.default.error("Failed to load templates or users.")}finally{B(!1)}})()},[]);let C=async a=>{if(a.preventDefault(),"specific"===o&&0===q.length)return void j.default.error("Please select at least one user.");if(!u||!w)return void j.default.error("Subject and message are required.");z(!0);try{await d.adminService.sendEmail({targetOption:o,userIds:q,templateId:s,subject:u,message:w}),j.default.success("Email campaign successfully initiated!")}catch(a){console.error("Email send failed:",a),j.default.error("Failed to send email. Please try again.")}finally{z(!1)}};return A?(0,b.jsx)("div",{className:"flex items-center justify-center min-h-[400px]",children:(0,b.jsx)("div",{className:"w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"})}):(0,b.jsxs)("div",{className:"max-w-4xl space-y-6 pb-20",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-white",children:"Email Marketing"}),(0,b.jsx)("p",{className:"text-gray-400 text-sm mt-1",children:"Create and send email campaigns to your users."})]}),(0,b.jsxs)("form",{onSubmit:C,className:"bg-[#111827] border border-gray-800 rounded-xl p-6 space-y-6",children:[(0,b.jsxs)("div",{className:"space-y-3",children:[(0,b.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,b.jsx)(f.Users,{className:"w-4 h-4 text-purple-400"}),"Target Audience"]}),(0,b.jsxs)("div",{className:"flex gap-4",children:[(0,b.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,b.jsx)("input",{type:"radio",name:"targetOption",checked:"all"===o,onChange:()=>p("all"),className:"text-purple-500 focus:ring-purple-500 bg-[#1F2937] border-gray-700"}),(0,b.jsx)("span",{className:"text-gray-300",children:"All Users"})]}),(0,b.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer",children:[(0,b.jsx)("input",{type:"radio",name:"targetOption",checked:"specific"===o,onChange:()=>p("specific"),className:"text-purple-500 focus:ring-purple-500 bg-[#1F2937] border-gray-700"}),(0,b.jsx)("span",{className:"text-gray-300",children:"Specific Users"})]})]}),"specific"===o&&(0,b.jsx)("div",{className:"mt-3 max-h-48 overflow-y-auto bg-[#1F2937] border border-gray-700 rounded-lg p-3 custom-scrollbar",children:(0,b.jsxs)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:[m.map(a=>(0,b.jsxs)("label",{className:"flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white",children:[(0,b.jsx)("input",{type:"checkbox",checked:q.includes(a.ID),onChange:()=>{var b;return b=a.ID,void r(a=>a.includes(b)?a.filter(a=>a!==b):[...a,b])},className:"rounded text-purple-500 focus:ring-purple-500 bg-[#111827] border-gray-600"}),(0,b.jsx)("span",{className:"truncate",children:a.user_email||a.user_login})]},a.ID)),0===m.length&&(0,b.jsx)("span",{className:"text-gray-500 text-sm",children:"No users found."})]})})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,b.jsx)(g.FileText,{className:"w-4 h-4 text-purple-400"}),"Email Template"]}),(0,b.jsxs)("select",{value:s,onChange:b=>{let c=b.target.value;t(c);let d=a.find(a=>a.id===c);d&&!u&&v(d.subject)},className:"w-full bg-[#1F2937] border border-gray-700 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500",children:[(0,b.jsx)("option",{value:"",children:"-- No Template (Custom Message) --"}),a.map(a=>(0,b.jsx)("option",{value:a.id,children:a.name},a.id))]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,b.jsx)(h.Type,{className:"w-4 h-4 text-purple-400"}),"Subject Line"]}),(0,b.jsx)("input",{type:"text",value:u,onChange:a=>v(a.target.value),placeholder:"e.g. Special Offer Just For You",required:!0,className:"w-full bg-[#1F2937] border border-gray-700 text-white text-sm rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-purple-500 placeholder-gray-500"})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)("label",{className:"text-sm font-semibold text-white flex items-center gap-2",children:[(0,b.jsx)(i.AlignLeft,{className:"w-4 h-4 text-purple-400"}),"Email Message"]}),(0,b.jsx)("div",{className:"bg-white rounded-lg overflow-hidden [&_.ql-editor]:min-h-[250px] [&_.ql-editor]:text-gray-900 border border-gray-300",children:(0,b.jsx)(k,{theme:"snow",value:w,onChange:x})}),(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4 mt-2",children:[(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,b.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ username }}"})," - User's name"]}),(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,b.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ login_id }}"})," - Account Login ID"]}),(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,b.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ platform }}"})," - Trading Platform"]}),(0,b.jsxs)("p",{className:"text-xs text-gray-500",children:[(0,b.jsx)("span",{className:"text-purple-400 font-mono",children:"{{ user_email }}"})," - User's Email"]})]})]}),(0,b.jsx)("div",{className:"pt-4 border-t border-gray-800 flex justify-end",children:(0,b.jsxs)("button",{type:"submit",disabled:y,className:"flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",children:[y?(0,b.jsx)("div",{className:"w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"}):(0,b.jsx)(e.Send,{className:"w-4 h-4"}),"Send Campaign"]})})]})]})}a.s(["default",()=>l])}];

//# sourceMappingURL=mrp_frontend_6a0c6125._.js.map