"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[249],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>d});var o=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,o,a=function(e,t){if(null==e)return{};var r,o,a={},n=Object.keys(e);for(o=0;o<n.length;o++)r=n[o],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)r=n[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=o.createContext({}),g=function(e){var t=o.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=g(e.components);return o.createElement(l.Provider,{value:t},e.children)},p="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},h=o.forwardRef((function(e,t){var r=e.components,a=e.mdxType,n=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=g(r),h=a,d=p["".concat(l,".").concat(h)]||p[h]||c[h]||n;return r?o.createElement(d,i(i({ref:t},u),{},{components:r})):o.createElement(d,i({ref:t},u))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var n=r.length,i=new Array(n);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[p]="string"==typeof e?e:a,i[1]=s;for(var g=2;g<n;g++)i[g]=r[g];return o.createElement.apply(null,i)}return o.createElement.apply(null,r)}h.displayName="MDXCreateElement"},1230:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>c,frontMatter:()=>n,metadata:()=>s,toc:()=>g});var o=r(3117),a=(r(7294),r(3905));const n={slug:"why-cursor-based-paging",title:"Why would I want cursor based paging?",authors:["johnsonjo4531"],tags:["why","pagination","cursors","cursor","cursoring","paging"]},i=void 0,s={permalink:"/mongoose-relay-paginate/blog/why-cursor-based-paging",editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/blog/2022-02-30-why-cursor-based-paging/index.md",source:"@site/blog/2022-02-30-why-cursor-based-paging/index.md",title:"Why would I want cursor based paging?",description:"TLDR; When should I choose cursoring?",date:"2022-03-02T00:00:00.000Z",formattedDate:"March 2, 2022",tags:[{label:"why",permalink:"/mongoose-relay-paginate/blog/tags/why"},{label:"pagination",permalink:"/mongoose-relay-paginate/blog/tags/pagination"},{label:"cursors",permalink:"/mongoose-relay-paginate/blog/tags/cursors"},{label:"cursor",permalink:"/mongoose-relay-paginate/blog/tags/cursor"},{label:"cursoring",permalink:"/mongoose-relay-paginate/blog/tags/cursoring"},{label:"paging",permalink:"/mongoose-relay-paginate/blog/tags/paging"}],readingTime:1.41,hasTruncateMarker:!1,authors:[{name:"John D. Johnson II",title:"Maintainer of mongoose-relay-paginate",url:"https://github.com/johnsonjo4531",imageURL:"https://github.com/johnsonjo4531.png",key:"johnsonjo4531"}],frontMatter:{slug:"why-cursor-based-paging",title:"Why would I want cursor based paging?",authors:["johnsonjo4531"],tags:["why","pagination","cursors","cursor","cursoring","paging"]},prevItem:{title:"What is cursoring and pagination?",permalink:"/mongoose-relay-paginate/blog/what-is-cursoring"}},l={authorsImageUrls:[void 0]},g=[{value:"TLDR; When should I choose cursoring?",id:"tldr-when-should-i-choose-cursoring",level:2},{value:"What are alternatives to cursor based paging?",id:"what-are-alternatives-to-cursor-based-paging",level:2}],u={toc:g},p="wrapper";function c(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"tldr-when-should-i-choose-cursoring"},"TLDR; When should I choose cursoring?"),(0,a.kt)("p",null,"When your new information is being added to the beggining of your sorted list that is returned from a database."),(0,a.kt)("h2",{id:"what-are-alternatives-to-cursor-based-paging"},"What are alternatives to cursor based paging?"),(0,a.kt)("p",null,"Cursor based paging is sometimes just called cursoring so as not to confuse the term with regular non-cursor based paging."),(0,a.kt)("p",null,"From here on in this blog post I will use paging to refer to non-cursor based paging and cursoring to refer to cursor based paging."),(0,a.kt)("p",null,"If you don't know what cursoring is ",(0,a.kt)("a",{parentName:"p",href:"/mongoose-relay-paginate/blog/what-is-cursoring"},"read more about cursoring here"),"."),(0,a.kt)("p",null,"Paging generally uses skip and limit. Paging is usually displayed in individual pages and allows one to move from page to page with something like this:"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"Pagination Buttons",src:r(9352).Z,width:"273",height:"63"})),(0,a.kt)("p",null,"Whereas Cursoring is usually displayed in an infinite scrolling feed."),(0,a.kt)("p",null,"The problem with paging is say your pages of items are from newest to oldest, and that you store 20 items on each page. You (the user) are on page 2 and suddenly 20 new items are submitted to the beginning of the list of items. Suddenly now you're on page 3, but the UI still shows you on page 2, so when you click on page 3 nothing would appear to happen."),(0,a.kt)("p",null,"To avoid this problem we use cursoring. Which instead of keeping track of where you are based off a skip and limit, it keeps track of where you are based off of any single item in the collection and then allows you to ask for things before or after that item. Each single item in a collection can be turned into a cursor, so that you can query other items relative to where that item is in the collection."))}c.isMDXComponent=!0},9352:(e,t,r)=>{r.d(t,{Z:()=>o});const o="data:image/png;base64,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"}}]);