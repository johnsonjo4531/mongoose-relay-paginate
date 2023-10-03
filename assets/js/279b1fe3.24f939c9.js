"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[244],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>b});var o=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),c=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=c(e.components);return o.createElement(l.Provider,{value:t},e.children)},u="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(n),m=r,b=u["".concat(l,".").concat(m)]||u[m]||g[m]||a;return n?o.createElement(b,i(i({ref:t},p),{},{components:n})):o.createElement(b,i({ref:t},p))}));function b(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,i=new Array(a);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[u]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<a;c++)i[c]=n[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},8572:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>g,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var o=n(3117),r=(n(7294),n(3905));const a={slug:"what-is-cursoring",title:"What is cursoring and pagination?",authors:["johnsonjo4531"],tags:["what","pagination","cursors","cursor","cursoring","paging"]},i=void 0,s={permalink:"/mongoose-relay-paginate/blog/what-is-cursoring",editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/blog/2022-02-30-what-is-cursoring-and-pagination.md",source:"@site/blog/2022-02-30-what-is-cursoring-and-pagination.md",title:"What is cursoring and pagination?",description:"A cursor helps a server to find an item in a database.",date:"2022-03-02T00:00:00.000Z",formattedDate:"March 2, 2022",tags:[{label:"what",permalink:"/mongoose-relay-paginate/blog/tags/what"},{label:"pagination",permalink:"/mongoose-relay-paginate/blog/tags/pagination"},{label:"cursors",permalink:"/mongoose-relay-paginate/blog/tags/cursors"},{label:"cursor",permalink:"/mongoose-relay-paginate/blog/tags/cursor"},{label:"cursoring",permalink:"/mongoose-relay-paginate/blog/tags/cursoring"},{label:"paging",permalink:"/mongoose-relay-paginate/blog/tags/paging"}],readingTime:.98,hasTruncateMarker:!1,authors:[{name:"John D. Johnson II",title:"Maintainer of mongoose-relay-paginate",url:"https://github.com/johnsonjo4531",imageURL:"https://github.com/johnsonjo4531.png",key:"johnsonjo4531"}],frontMatter:{slug:"what-is-cursoring",title:"What is cursoring and pagination?",authors:["johnsonjo4531"],tags:["what","pagination","cursors","cursor","cursoring","paging"]},nextItem:{title:"Why would I want cursor based paging?",permalink:"/mongoose-relay-paginate/blog/why-cursor-based-paging"}},l={authorsImageUrls:[void 0]},c=[],p={toc:c},u="wrapper";function g(e){let{components:t,...n}=e;return(0,r.kt)(u,(0,o.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"A cursor helps a server to find an item in a database."),(0,r.kt)("p",null,"If you're not exactly sure what that means here's an analogy.\nIt's a lot like when you go to the library and have some information for\na specific book. This information you have about the book can help you locate it."),(0,r.kt)("p",null,"A cursor (some information) can be turned into a database object (the book) by finding the first instance of it in the database (the library)."),(0,r.kt)("p",null,"Below is a hypothetical example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'Cursor        -> Some query from a cursor -> DB Object\n{name: "bob"} -> Some query from a cursor -> {name: "bob", job: "something", location: "some place 123rd street"}\n')),(0,r.kt)("p",null,"An example of some query from a cursor, in MongoDB is:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'const {name, job, location} = await Employee.findOne({name: "bob"});\n')),(0,r.kt)("p",null,"A database object can be turned into a cursor with a transform of some sort in our case it will be provided by the user."),(0,r.kt)("p",null,"Below is a hypothetical example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},'DB Object -> some transform to a cursor -> Cursor\n{\n   name: "bob",\n   job: "something",\n   location: "some place 123rd street"\n}        -> some tranform to a cursor  -> {name: "bob"}\n')))}g.isMDXComponent=!0}}]);