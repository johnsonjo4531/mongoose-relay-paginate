"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[616],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return y}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(n),y=a,f=m["".concat(s,".").concat(y)]||m[y]||p[y]||o;return n?r.createElement(f,i(i({ref:t},u),{},{components:n})):r.createElement(f,i({ref:t},u))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},6286:function(e,t,n){n.r(t),n.d(t,{assets:function(){return u},contentTitle:function(){return s},default:function(){return y},frontMatter:function(){return l},metadata:function(){return c},toc:function(){return p}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],l={},s="relayPaginate()",c={unversionedId:"API/relayPaginate",id:"API/relayPaginate",title:"relayPaginate()",description:"You'll need to import this package at the top of your entry file:",source:"@site/docs/API/relayPaginate.md",sourceDirName:"API",slug:"/API/relayPaginate",permalink:"/mongoose-relay-paginate/docs/API/relayPaginate",editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/docs/API/relayPaginate.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"aggregateRelayPaginate()",permalink:"/mongoose-relay-paginate/docs/API/aggregateRelayPaginate"},next:{title:"Full Example",permalink:"/mongoose-relay-paginate/docs/full-example"}},u={},p=[],m={toc:p};function y(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"relaypaginate"},"relayPaginate()"),(0,o.kt)("p",null,"You'll need to import this package at the top of your entry file:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'import "mongoose-relay-paginate";\n')),(0,o.kt)("p",null,"Then you can use ",(0,o.kt)("inlineCode",{parentName:"p"},".relayPaginate()")," off of any mongoose query."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'const result = await UserModel.find()\n  // This is just the default mongoose sort\n  .sort({ _id: -1 })\n  // We can use the relayPaginate from this library off of any Query.\n  .relayPaginate({\n    cursorKeys: ["_id"],\n    first: 1,\n  });\n')),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"relayPaginate")," takes in only one argument and that is its options  argument."),(0,o.kt)("p",null,"The only necessary part of relayPaginate option is the cursorKeys property you pass in. Abstractly ",(0,o.kt)("inlineCode",{parentName:"p"},"cursorKeys")," is an array which defines what properties on the cursor for the specific query. The cursor defines a way that the specific item in a collection should be found. Say for example you have three user's with names: Bill, Jill, and Phill, which could be created like so."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'const doc = new UserModel({\n  name: "Bill",\n  email: "bill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\n\nconst doc2 = new UserModel({\n  name: "Jill",\n  email: "jill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\n\nconst doc3 = new UserModel({\n  name: "Phill",\n  email: "Phill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\nawait doc.save();\nawait doc2.save();\nawait doc3.save();\n')),(0,o.kt)("p",null,"The ",(0,o.kt)("inlineCode",{parentName:"p"},"cursorKeys")," here below select the user's name as the cursor. This means the before and after options, if provided, also have to fit this shape in order to return the proper output."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'const result = await UserModel.find()\n    // We sort by names from a-z\n    .sort({ name: 1 })\n    .relayPaginate({\n      // we allow the cursor to be the user\'s name\n      cursorKeys: ["name"],\n      // we get the first 2 items only\n      first: 2,\n      // We start getting results only after we have found bill\'s record\n      after: {\n        name: "Bill"\n      }\n    });\nconsole.log(result.nodes); // Will be an array of Jill and then Phill\'s object\n')),(0,o.kt)("p",null,"Generally you would want the cursor (represented by the ",(0,o.kt)("inlineCode",{parentName:"p"},"cursorKeys")," prop, and the before and after options) to match whatever you are sorting by."))}y.isMDXComponent=!0}}]);