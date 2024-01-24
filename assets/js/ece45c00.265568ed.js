"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[1616],{9984:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>s,toc:()=>d});var t=a(5893),o=a(1151);const i={sidebar_position:1},r="relayPaginate()",s={id:"API/relayPaginate",title:"relayPaginate()",description:"After familiarizing yourself with the intro and installing.",source:"@site/docs/API/relayPaginate.md",sourceDirName:"API",slug:"/API/relayPaginate",permalink:"/mongoose-relay-paginate/docs/API/relayPaginate",draft:!1,unlisted:!1,editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/docs/API/relayPaginate.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Installation",permalink:"/mongoose-relay-paginate/docs/installation"},next:{title:"aggregateRelayPaginate()",permalink:"/mongoose-relay-paginate/docs/API/aggregateRelayPaginate"}},l={},d=[];function c(e){const n={a:"a",code:"code",h1:"h1",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"relaypaginate",children:"relayPaginate()"}),"\n",(0,t.jsxs)(n.p,{children:["After familiarizing yourself with the ",(0,t.jsx)(n.a,{href:"/mongoose-relay-paginate/docs/intro",children:"intro"})," and ",(0,t.jsx)(n.a,{href:"/mongoose-relay-paginate/docs/installation",children:"installing"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["You can then use ",(0,t.jsx)(n.code,{children:".relayPaginate()"})," off of any mongoose query you setup following the install process."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const result = await UserModel.find()\n  // This is just the default mongoose sort\n  .sort({ _id: -1 })\n  // We can use the relayPaginate from this library off of any Query.\n  .relayPaginate({\n    first: 1,\n  });\n"})}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"relayPaginate"})," takes in only one argument and that is its options  argument."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:'const doc = new UserModel({\n  name: "Bill",\n  email: "bill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\n\nconst doc2 = new UserModel({\n  name: "Jill",\n  email: "jill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\n\nconst doc3 = new UserModel({\n  name: "Phill",\n  email: "Phill@example.com",\n  avatar: "https://i.imgur.com/dM7Thhn.png",\n});\nawait doc.save();\nawait doc2.save();\nawait doc3.save();\n\nconst result = await UserModel.find()\n    // We sort by names from a-z\n    .sort({ name: 1 })\n    .relayPaginate({\n      // we get the first 2 items only\n      first: 2,\n      // We start getting results only after we have found bill\'s record\n      after: {\n        name: "Bill"\n      }\n    });\nconsole.log(result.nodes); // Will be an array of Jill and then Phill\'s object\n'})}),"\n",(0,t.jsx)(n.p,{children:"Generally you would want the cursor (represented by your before and after options) to match whatever you are sorting by; a good default if you don't know what you are sorting by is to use the _id field as your cursor as it is the default sort field in mongodb, though this default is unnecessary in newer versions of the library."}),"\n",(0,t.jsx)(n.p,{children:"Generally this is unnecessary to think about as both relayPaginates (the aggregate and non-aggregate) should return to you start cursors and end cursors to paginate by in your before and after."}),"\n",(0,t.jsx)(n.p,{children:"The before and after options, if provided, have to fit atleast the shape of the sort in order to return the proper output."}),"\n",(0,t.jsxs)(n.p,{children:["So if your sort was by ",(0,t.jsx)(n.code,{children:"{ name: 1 }"})," the following would be good and bad examples."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:'// good after cursor since it includes name\n{\n  after: {\n    name: "Bill"\n  }\n};\n// still good after cursor since it includes name (though\n// the email is unneccessary, it is both ignored and\n// completely fine to send in.)\n{\n  after: {\n    name: "Jill",\n    email: "jill@example.com"\n  }\n};\n\n// Bad example of an after cursor does not include a name...\n// which is the field(s) to sort by.\n{\n  after: {\n    email: "bill@example.com"\n  }\n};\n\n// Good example of an after cursor as it again includes the name.\n// Again it also ignores the email and avatar fields\' as\n// they aren\'t part of the sort.\n{\n  after: {\n    name: "Bill",\n    email: "bill@example.com",\n    avatar: "https://i.imgur.com/dM7Thhn.png",\n  }\n};\n\n// Good example of an after cursor as it again includes the name.\n// Notice how this time the after cursor is a mixture of\n// both Bill and Jill\'s information, but since the email is\n// ignored Bill\'s record can still be found since it is only\n// his information in the name field. Again it also ignores\n// the email and avatar fields\' as they aren\'t part of the sort.\n{\n  after: {\n    name: "Bill",\n    email: "jill@example.com",\n    avatar: "https://i.imgur.com/dM7Thhn.png",\n  }\n};\n'})}),"\n",(0,t.jsx)(n.p,{children:"All the above good examples should also work with the before cursors and the bad examples would not work with them."}),"\n",(0,t.jsxs)(n.p,{children:["If your sort was by ",(0,t.jsx)(n.code,{children:"{ name: 1, email: 1 }"})," then you would have to include the name, and email field and values in the cursor fields for before and after."]})]})}function h(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(c,{...e})}):c(e)}},1151:(e,n,a)=>{a.d(n,{Z:()=>s,a:()=>r});var t=a(7294);const o={},i=t.createContext(o);function r(e){const n=t.useContext(i);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),t.createElement(i.Provider,{value:n},e.children)}}}]);