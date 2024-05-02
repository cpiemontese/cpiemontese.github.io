(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[522],{6691:function(e,t){"use strict";var r,n,o,l;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ACTION_FAST_REFRESH:function(){return s},ACTION_NAVIGATE:function(){return f},ACTION_PREFETCH:function(){return i},ACTION_REFRESH:function(){return u},ACTION_RESTORE:function(){return a},ACTION_SERVER_ACTION:function(){return d},ACTION_SERVER_PATCH:function(){return c},PrefetchCacheEntryStatus:function(){return n},PrefetchKind:function(){return r},isThenable:function(){return p}});let u="refresh",f="navigate",a="restore",c="server-patch",i="prefetch",s="fast-refresh",d="server-action";function p(e){return e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}(o=r||(r={})).AUTO="auto",o.FULL="full",o.TEMPORARY="temporary",(l=n||(n={})).fresh="fresh",l.reusable="reusable",l.expired="expired",l.stale="stale",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4318:function(e,t,r){"use strict";function n(e,t,r,n){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return n}}),r(8364),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9577:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return g}});let n=r(8754),o=r(5893),l=n._(r(7294)),u=r(1401),f=r(2045),a=r(7420),c=r(7201),i=r(1443),s=r(9953),d=r(5320),p=r(2905),y=r(4318),h=r(953),b=r(6691),v=new Set;function O(e,t,r,n,o,l){if(l||(0,f.isLocalURL)(t)){if(!n.bypassPrefetchedCheck){let o=t+"%"+r+"%"+(void 0!==n.locale?n.locale:"locale"in e?e.locale:void 0);if(v.has(o))return;v.add(o)}Promise.resolve(l?e.prefetch(t,o):e.prefetch(t,r,n)).catch(e=>{})}}function _(e){return"string"==typeof e?e:(0,a.formatUrl)(e)}let g=l.default.forwardRef(function(e,t){let r,n;let{href:a,as:v,children:g,prefetch:m=null,passHref:C,replace:E,shallow:j,scroll:P,locale:T,onClick:M,onMouseEnter:R,onTouchStart:k,legacyBehavior:x=!1,...A}=e;r=g,x&&("string"==typeof r||"number"==typeof r)&&(r=(0,o.jsx)("a",{children:r}));let w=l.default.useContext(s.RouterContext),I=l.default.useContext(d.AppRouterContext),N=null!=w?w:I,S=!w,L=!1!==m,U=null===m?b.PrefetchKind.AUTO:b.PrefetchKind.FULL,{href:K,as:F}=l.default.useMemo(()=>{if(!w){let e=_(a);return{href:e,as:v?_(v):e}}let[e,t]=(0,u.resolveHref)(w,a,!0);return{href:e,as:v?(0,u.resolveHref)(w,v):t||e}},[w,a,v]),H=l.default.useRef(K),z=l.default.useRef(F);x&&(n=l.default.Children.only(r));let D=x?n&&"object"==typeof n&&n.ref:t,[V,q,B]=(0,p.useIntersection)({rootMargin:"200px"}),G=l.default.useCallback(e=>{(z.current!==F||H.current!==K)&&(B(),z.current=F,H.current=K),V(e),D&&("function"==typeof D?D(e):"object"==typeof D&&(D.current=e))},[F,D,K,B,V]);l.default.useEffect(()=>{N&&q&&L&&O(N,K,F,{locale:T},{kind:U},S)},[F,K,q,T,L,null==w?void 0:w.locale,N,S,U]);let W={ref:G,onClick(e){x||"function"!=typeof M||M(e),x&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(e),N&&!e.defaultPrevented&&function(e,t,r,n,o,u,a,c,i){let{nodeName:s}=e.currentTarget;if("A"===s.toUpperCase()&&(function(e){let t=e.currentTarget.getAttribute("target");return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!i&&!(0,f.isLocalURL)(r)))return;e.preventDefault();let d=()=>{let e=null==a||a;"beforePopState"in t?t[o?"replace":"push"](r,n,{shallow:u,locale:c,scroll:e}):t[o?"replace":"push"](n||r,{scroll:e})};i?l.default.startTransition(d):d()}(e,N,K,F,E,j,P,T,S)},onMouseEnter(e){x||"function"!=typeof R||R(e),x&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),N&&(L||!S)&&O(N,K,F,{locale:T,priority:!0,bypassPrefetchedCheck:!0},{kind:U},S)},onTouchStart:function(e){x||"function"!=typeof k||k(e),x&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),N&&(L||!S)&&O(N,K,F,{locale:T,priority:!0,bypassPrefetchedCheck:!0},{kind:U},S)}};if((0,c.isAbsoluteUrl)(F))W.href=F;else if(!x||C||"a"===n.type&&!("href"in n.props)){let e=void 0!==T?T:null==w?void 0:w.locale,t=(null==w?void 0:w.isLocaleDomain)&&(0,y.getDomainLocale)(F,e,null==w?void 0:w.locales,null==w?void 0:w.domainLocales);W.href=t||(0,h.addBasePath)((0,i.addLocale)(F,e,null==w?void 0:w.defaultLocale))}return x?l.default.cloneElement(n,W):(0,o.jsx)("a",{...A,...W,children:r})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2905:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return a}});let n=r(7294),o=r(3815),l="function"==typeof IntersectionObserver,u=new Map,f=[];function a(e){let{rootRef:t,rootMargin:r,disabled:a}=e,c=a||!l,[i,s]=(0,n.useState)(!1),d=(0,n.useRef)(null),p=(0,n.useCallback)(e=>{d.current=e},[]);return(0,n.useEffect)(()=>{if(l){if(c||i)return;let e=d.current;if(e&&e.tagName)return function(e,t,r){let{id:n,observer:o,elements:l}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},n=f.find(e=>e.root===r.root&&e.margin===r.margin);if(n&&(t=u.get(n)))return t;let o=new Map;return t={id:r,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=o.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e),elements:o},f.push(r),u.set(r,t),t}(r);return l.set(e,t),o.observe(e),function(){if(l.delete(e),o.unobserve(e),0===l.size){o.disconnect(),u.delete(n);let e=f.findIndex(e=>e.root===n.root&&e.margin===n.margin);e>-1&&f.splice(e,1)}}}(e,e=>e&&s(e),{root:null==t?void 0:t.current,rootMargin:r})}else if(!i){let e=(0,o.requestIdleCallback)(()=>s(!0));return()=>(0,o.cancelIdleCallback)(e)}},[c,r,t,i,d.current]),[p,i,(0,n.useCallback)(()=>{s(!1)},[])]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},3141:function(e,t,r){"use strict";r.d(t,{w_:function(){return a}});var n=r(7294),o={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},l=n.createContext&&n.createContext(o),u=function(){return(u=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},f=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r};function a(e){return function(t){return n.createElement(c,u({attr:u({},e.attr)},t),function e(t){return t&&t.map(function(t,r){return n.createElement(t.tag,u({key:r},t.attr),e(t.child))})}(e.child))}}function c(e){var t=function(t){var r,o=e.attr,l=e.size,a=e.title,c=f(e,["attr","size","title"]),i=l||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),n.createElement("svg",u({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,o,c,{className:r,style:u(u({color:e.color||t.color},t.style),e.style),height:i,width:i,xmlns:"http://www.w3.org/2000/svg"}),a&&n.createElement("title",null,a),e.children)};return void 0!==l?n.createElement(l.Consumer,null,function(e){return t(e)}):t(o)}},9008:function(e,t,r){e.exports=r(7828)},1664:function(e,t,r){e.exports=r(9577)}}]);