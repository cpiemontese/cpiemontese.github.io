(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[831],{9783:function(e,t){"use strict";var r,n;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{PrefetchKind:function(){return r},ACTION_REFRESH:function(){return o},ACTION_NAVIGATE:function(){return l},ACTION_RESTORE:function(){return u},ACTION_SERVER_PATCH:function(){return a},ACTION_PREFETCH:function(){return i},ACTION_FAST_REFRESH:function(){return c},ACTION_SERVER_ACTION:function(){return f}});let o="refresh",l="navigate",u="restore",a="server-patch",i="prefetch",c="fast-refresh",f="server-action";(n=r||(r={})).AUTO="auto",n.FULL="full",n.TEMPORARY="temporary",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},358:function(e,t,r){"use strict";function getDomainLocale(e,t,r,n){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return getDomainLocale}}),r(4005),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2994:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return g}});let n=r(8754),o=n._(r(7294)),l=r(6722),u=r(4812),a=r(7822),i=r(9938),c=r(5017),f=r(5734),s=r(8503),d=r(7549),p=r(358),y=r(1417),_=r(9783),v=new Set;function prefetch(e,t,r,n,o,l){if(!l&&!(0,u.isLocalURL)(t))return;if(!n.bypassPrefetchedCheck){let o=void 0!==n.locale?n.locale:"locale"in e?e.locale:void 0,l=t+"%"+r+"%"+o;if(v.has(l))return;v.add(l)}let a=l?e.prefetch(t,o):e.prefetch(t,r,n);Promise.resolve(a).catch(e=>{})}function formatStringOrUrl(e){return"string"==typeof e?e:(0,a.formatUrl)(e)}let h=o.default.forwardRef(function(e,t){let r,n;let{href:a,as:v,children:h,prefetch:g=null,passHref:b,replace:m,shallow:O,scroll:E,locale:C,onClick:P,onMouseEnter:j,onTouchStart:T,legacyBehavior:I=!1,...M}=e;r=h,I&&("string"==typeof r||"number"==typeof r)&&(r=o.default.createElement("a",null,r));let R=o.default.useContext(f.RouterContext),k=o.default.useContext(s.AppRouterContext),A=null!=R?R:k,N=!R,w=!1!==g,S=null===g?_.PrefetchKind.AUTO:_.PrefetchKind.FULL,{href:x,as:L}=o.default.useMemo(()=>{if(!R){let e=formatStringOrUrl(a);return{href:e,as:v?formatStringOrUrl(v):e}}let[e,t]=(0,l.resolveHref)(R,a,!0);return{href:e,as:v?(0,l.resolveHref)(R,v):t||e}},[R,a,v]),U=o.default.useRef(x),K=o.default.useRef(L);I&&(n=o.default.Children.only(r));let D=I?n&&"object"==typeof n&&n.ref:t,[F,H,z]=(0,d.useIntersection)({rootMargin:"200px"}),B=o.default.useCallback(e=>{(K.current!==L||U.current!==x)&&(z(),K.current=L,U.current=x),F(e),D&&("function"==typeof D?D(e):"object"==typeof D&&(D.current=e))},[L,D,x,z,F]);o.default.useEffect(()=>{A&&H&&w&&prefetch(A,x,L,{locale:C},{kind:S},N)},[L,x,H,C,w,null==R?void 0:R.locale,A,N,S]);let G={ref:B,onClick(e){I||"function"!=typeof P||P(e),I&&n.props&&"function"==typeof n.props.onClick&&n.props.onClick(e),A&&!e.defaultPrevented&&function(e,t,r,n,l,a,i,c,f,s){let{nodeName:d}=e.currentTarget,p="A"===d.toUpperCase();if(p&&(function(e){let t=e.currentTarget,r=t.getAttribute("target");return r&&"_self"!==r||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!f&&!(0,u.isLocalURL)(r)))return;e.preventDefault();let navigate=()=>{let e=null==i||i;"beforePopState"in t?t[l?"replace":"push"](r,n,{shallow:a,locale:c,scroll:e}):t[l?"replace":"push"](n||r,{forceOptimisticNavigation:!s,scroll:e})};f?o.default.startTransition(navigate):navigate()}(e,A,x,L,m,O,E,C,N,w)},onMouseEnter(e){I||"function"!=typeof j||j(e),I&&n.props&&"function"==typeof n.props.onMouseEnter&&n.props.onMouseEnter(e),A&&(w||!N)&&prefetch(A,x,L,{locale:C,priority:!0,bypassPrefetchedCheck:!0},{kind:S},N)},onTouchStart(e){I||"function"!=typeof T||T(e),I&&n.props&&"function"==typeof n.props.onTouchStart&&n.props.onTouchStart(e),A&&(w||!N)&&prefetch(A,x,L,{locale:C,priority:!0,bypassPrefetchedCheck:!0},{kind:S},N)}};if((0,i.isAbsoluteUrl)(L))G.href=L;else if(!I||b||"a"===n.type&&!("href"in n.props)){let e=void 0!==C?C:null==R?void 0:R.locale,t=(null==R?void 0:R.isLocaleDomain)&&(0,p.getDomainLocale)(L,e,null==R?void 0:R.locales,null==R?void 0:R.domainLocales);G.href=t||(0,y.addBasePath)((0,c.addLocale)(L,e,null==R?void 0:R.defaultLocale))}return I?o.default.cloneElement(n,G):o.default.createElement("a",{...M,...G},r)}),g=h;("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},7549:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return useIntersection}});let n=r(7294),o=r(517),l="function"==typeof IntersectionObserver,u=new Map,a=[];function useIntersection(e){let{rootRef:t,rootMargin:r,disabled:i}=e,c=i||!l,[f,s]=(0,n.useState)(!1),d=(0,n.useRef)(null),p=(0,n.useCallback)(e=>{d.current=e},[]);(0,n.useEffect)(()=>{if(l){if(c||f)return;let e=d.current;if(e&&e.tagName){let n=function(e,t,r){let{id:n,observer:o,elements:l}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},n=a.find(e=>e.root===r.root&&e.margin===r.margin);if(n&&(t=u.get(n)))return t;let o=new Map,l=new IntersectionObserver(e=>{e.forEach(e=>{let t=o.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e);return t={id:r,observer:l,elements:o},a.push(r),u.set(r,t),t}(r);return l.set(e,t),o.observe(e),function(){if(l.delete(e),o.unobserve(e),0===l.size){o.disconnect(),u.delete(n);let e=a.findIndex(e=>e.root===n.root&&e.margin===n.margin);e>-1&&a.splice(e,1)}}}(e,e=>e&&s(e),{root:null==t?void 0:t.current,rootMargin:r});return n}}else if(!f){let e=(0,o.requestIdleCallback)(()=>s(!0));return()=>(0,o.cancelIdleCallback)(e)}},[c,r,t,f,d.current]);let y=(0,n.useCallback)(()=>{s(!1)},[]);return[p,f,y]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9008:function(e,t,r){e.exports=r(4605)},1664:function(e,t,r){e.exports=r(2994)},8357:function(e,t,r){"use strict";r.d(t,{w_:function(){return GenIcon}});var n=r(7294),o={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},l=n.createContext&&n.createContext(o),__assign=function(){return(__assign=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var o in t=arguments[r])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},__rest=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r};function GenIcon(e){return function(t){return n.createElement(IconBase,__assign({attr:__assign({},e.attr)},t),function Tree2Element(e){return e&&e.map(function(e,t){return n.createElement(e.tag,__assign({key:t},e.attr),Tree2Element(e.child))})}(e.child))}}function IconBase(e){var elem=function(t){var r,o=e.attr,l=e.size,u=e.title,a=__rest(e,["attr","size","title"]),i=l||t.size||"1em";return t.className&&(r=t.className),e.className&&(r=(r?r+" ":"")+e.className),n.createElement("svg",__assign({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,o,a,{className:r,style:__assign(__assign({color:e.color||t.color},t.style),e.style),height:i,width:i,xmlns:"http://www.w3.org/2000/svg"}),u&&n.createElement("title",null,u),e.children)};return void 0!==l?n.createElement(l.Consumer,null,function(e){return elem(e)}):elem(o)}}}]);