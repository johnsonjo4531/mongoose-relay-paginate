"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[616],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>f});var a=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=a.createContext({}),u=function(e){var n=a.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=u(e.components);return a.createElement(s.Provider,{value:n},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},d=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(t),d=r,f=p["".concat(s,".").concat(d)]||p[d]||m[d]||o;return t?a.createElement(f,i(i({ref:n},c),{},{components:t})):a.createElement(f,i({ref:n},c))}));function f(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=d;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l[p]="string"==typeof e?e:r,i[1]=l;for(var u=2;u<o;u++)i[u]=t[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6286:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>u});var a=t(3117),r=(t(7294),t(3905));const o={},i="relayPaginate()",l={unversionedId:"API/relayPaginate",id:"API/relayPaginate",title:"relayPaginate()",description:"After following the intro.",source:"@site/docs/API/relayPaginate.md",sourceDirName:"API",slug:"/API/relayPaginate",permalink:"/mongoose-relay-paginate/docs/API/relayPaginate",draft:!1,editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/docs/API/relayPaginate.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"aggregateRelayPaginate()",permalink:"/mongoose-relay-paginate/docs/API/aggregateRelayPaginate"},next:{title:"GraphQL Server Example",permalink:"/mongoose-relay-paginate/docs/examples/graphql-example"}},s={},u=[],c={toc:u},p="wrapper";function m(e){let{components:n,...t}=e;return(0,r.kt)(p,(0,a.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"relaypaginate"},"relayPaginate()"),(0,r.kt)("p",null,"After following the ",(0,r.kt)("a",{parentName:"p",href:"/mongoose-relay-paginate/docs/intro"},"intro"),"."),(0,r.kt)("p",null,"You can then use ",(0,r.kt)("inlineCode",{parentName:"p"},".relayPaginate()")," off of any mongoose query you setup following the intro."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const result = await UserModel.find()\n  // This is just the default mongoose sort\n  .sort({ _id: -1 })\n  // We can use the relayPaginate from this library off of any Query.\n  .relayPaginate({\n    first: 1,\n  });\n")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"relayPaginate")," takes in only one argument and that is its options  argument."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'const doc = new UserModel({\n  name: "Bill",\n  email: "bill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\n\nconst doc2 = new UserModel({\n  name: "Jill",\n  email: "jill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\n\nconst doc3 = new UserModel({\n  name: "Phill",\n  email: "Phill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\nawait doc.save();\nawait doc2.save();\nawait doc3.save();\n\nconst result = await UserModel.find()\n    // We sort by names from a-z\n    .sort({ name: 1 })\n    .relayPaginate({\n      // we get the first 2 items only\n      first: 2,\n      // We start getting results only after we have found bill\'s record\n      after: {\n        name: "Bill"\n      }\n    });\nconsole.log(result.nodes); // Will be an array of Jill and then Phill\'s object\n')),(0,r.kt)("p",null,"Generally you would want the cursor (represented by your before and after options) to match whatever you are sorting by; a good default if you don't know what you are sorting by is to use the _id field as your cursor as it is the default sort field in mongodb, though this default is unnecessary in newer versions of the library."),(0,r.kt)("p",null,"Generally this is unnecessary to think about as both relayPaginates (aggregate and non-aggregate) should return to you start cursors and end cursors to paginate by in your before and after."),(0,r.kt)("p",null,"The before and after options, if provided, have to fit atleast the shape of the sort in order to return the proper output."),(0,r.kt)("p",null,"So if your sort was by ",(0,r.kt)("inlineCode",{parentName:"p"},"{ name: 1 }")," the following would be good and bad examples."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},'// good after cursor since it includes name\n{\n  after: {\n    name: "Bill"\n  }\n};\n// still good after cursor since it includes name (though\n// the email is unneccessary, it is both ignored and\n// completely fine to send in.)\n{\n  after: {\n    name: "Jill",\n    email: "jill@example.com"\n  }\n};\n\n// Bad example of an after cursor does not include a name...\n// which is the field(s) to sort by.\n{\n  after: {\n    email: "bill@example.com"\n  }\n};\n\n// Good example of an after cursor as it again includes the name.\n// Again it also ignores the email and avatar fields\' as\n// they aren\'t part of the sort.\n{\n  after: {\n    name: "Bill",\n    email: "bill@example.com",\n    avatar: "https://i.imgur.com/dM7Thhn.png",\n  }\n};\n\n// Good example of an after cursor as it again includes the name.\n// Notice how this time the after cursor is a mixture of\n// both Bill and Jill\'s information, but since the email is\n// ignored Bill\'s record can still be found since it is only\n// his information in the name field. Again it also ignores\n// the email and avatar fields\' as they aren\'t part of the sort.\n{\n  after: {\n    name: "Bill",\n    email: "jill@example.com",\n    avatar: "https://i.imgur.com/dM7Thhn.png",\n  }\n};\n')),(0,r.kt)("p",null,"All the above good examples should also work with the before cursors and the bad examples would not work with them."),(0,r.kt)("p",null,"If your sort was by ",(0,r.kt)("inlineCode",{parentName:"p"},"{ name: 1, email: 1 }")," then you would have to include the name, and email field and values in the cursor fields for before and after."))}m.isMDXComponent=!0}}]);