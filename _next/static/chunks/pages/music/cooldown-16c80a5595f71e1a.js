(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[645],{9866:(e,t,n)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/music/cooldown",function(){return n(868)}])},3681:(e,t,n)=>{"use strict";n.d(t,{EN:()=>x,IT:()=>o,Z:()=>d});var s=n(5893),l=n(9008),r=n.n(l),a=n(7294);function i(e){let{toggled:t,setToggled:n}=e;return(0,s.jsxs)("div",{className:"flex w-max items-center",children:[(0,s.jsx)("div",{children:"\uD83C\uDDEC\uD83C\uDDE7"}),(0,s.jsx)("button",{className:"flex items-center mx-2 px-0.5 bg-gray-200 dark:bg-gray-600 w-8 h-4 rounded-full focus:outline-none",onClick:()=>n(!t),children:(0,s.jsx)("div",{className:"bg-white dark:bg-gray-900 w-3 h-3 rounded-full smooth ".concat(t?"translate-x-4":"translate-x-0")})}),(0,s.jsx)("div",{children:"\uD83C\uDDEE\uD83C\uDDF9"})]})}let c="".concat("Cristiano Piemontese"," Portfolio"),o="IT",x="EN";function d(e){let{hasToggle:t,children:n}=e,[l,d]=(0,a.useState)(!1);return(0,s.jsxs)("div",{className:"max-w-4xl min-h-screen mx-auto overflow-hidden",children:[(0,s.jsxs)(r(),{children:[(0,s.jsx)("link",{rel:"icon",href:"/favicon.ico"}),(0,s.jsx)("meta",{name:"description",content:c}),(0,s.jsx)("meta",{property:"og:image",content:"https://og-image.now.sh/".concat(encodeURI(c),".png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg")}),(0,s.jsx)("meta",{name:"og:title",content:c})]}),t?(0,s.jsx)("header",{className:"fixed flex justify-end h-8 max-w-4xl w-full items-center px-8 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",children:(0,s.jsx)(i,{toggled:l,setToggled:d})}):(0,s.jsx)(s.Fragment,{}),(0,s.jsx)("main",{className:t?"mt-8":"",children:n({lang:l?o:x})})]})}},7865:(e,t,n)=>{"use strict";n.d(t,{Nr:()=>l,TV:()=>r,bx:()=>s});let s=["A","B","C","D","E","G","F","Ab","Bb","Db","Eb","Gb"],l=()=>s[Math.floor(Math.random()*s.length)];function r(e){let t=[...e];for(let n=e.length-1;n>0;n--){let e=Math.floor(Math.random()*(n+1));[t[n],t[e]]=[t[e],t[n]]}return t}},868:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>c});var s=n(5893),l=n(7294),r=n(3681),a=n(7865);let i=["4","1","13b","7","5#","11","3","2#","1","4","6b","3","7b","5#","11#","6b","1","3b","5#","6","7","3","5#","13","11","1","6b","5b","3b","13b","1","7b","5","11#","6b","3","5#","4","6b","7b","5b","4","3b","2","5#","11","7b","5","6b","13","5#","4","11#","13b","7","5","6b","4","1","6","5","3b","4","6b","1","5b","1","2b","2","2#","3b","3","4","4#","5b","5","5#","6b","6","7b","7","9b","9","9#","11","11#","13b","13"];function c(){let[e,t]=(0,l.useState)(0),[n,c]=(0,l.useState)(!1),[o,x]=(0,l.useState)(null);return(0,l.useEffect)(()=>{x((0,a.Nr)())},[]),(0,s.jsx)(r.Z,{children:l=>{let{_lang:r}=l;return(0,s.jsx)(s.Fragment,{children:(0,s.jsx)("div",{id:"cooldown",className:"flex flex-col min-h-screen items-center place-content-center select-none",onClick:()=>{if(!n){c(!0);return}e+1===i.length?(c(!1),t(0),x((0,a.Nr)())):t(e+1)},children:n?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("div",{className:"text-5xl lg:text-6xl mb-8",children:i[e]},"interval"),(0,s.jsxs)("div",{className:"text-xl md:text-3xl lg:text-4xl",children:[e+1," / ",i.length]},"remainder")]}):(0,s.jsxs)("div",{className:"text-3xl md:text-5xl lg:text-6xl",children:["Starting note: ",o]},"starting-note")})})}})}},9008:(e,t,n)=>{e.exports=n(3867)}},e=>{var t=t=>e(e.s=t);e.O(0,[888,774,179],()=>t(9866)),_N_E=e.O()}]);