"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[2320],{8386:(e,o,n)=>{n.r(o),n.d(o,{assets:()=>c,contentTitle:()=>s,default:()=>u,frontMatter:()=>r,metadata:()=>i,toc:()=>l});var a=n(5893),t=n(1151);const r={slug:"what-is-cursoring",title:"What is cursoring and pagination?",authors:["johnsonjo4531"],tags:["what","pagination","cursors","cursor","cursoring","paging"]},s=void 0,i={permalink:"/mongoose-relay-paginate/blog/what-is-cursoring",editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/blog/2022-02-30-what-is-cursoring-and-pagination.md",source:"@site/blog/2022-02-30-what-is-cursoring-and-pagination.md",title:"What is cursoring and pagination?",description:"A cursor helps a server to find an item in a database.",date:"2022-03-02T00:00:00.000Z",formattedDate:"March 2, 2022",tags:[{label:"what",permalink:"/mongoose-relay-paginate/blog/tags/what"},{label:"pagination",permalink:"/mongoose-relay-paginate/blog/tags/pagination"},{label:"cursors",permalink:"/mongoose-relay-paginate/blog/tags/cursors"},{label:"cursor",permalink:"/mongoose-relay-paginate/blog/tags/cursor"},{label:"cursoring",permalink:"/mongoose-relay-paginate/blog/tags/cursoring"},{label:"paging",permalink:"/mongoose-relay-paginate/blog/tags/paging"}],readingTime:.98,hasTruncateMarker:!1,authors:[{name:"John D. Johnson II",title:"Maintainer of mongoose-relay-paginate",url:"https://github.com/johnsonjo4531",imageURL:"https://github.com/johnsonjo4531.png",key:"johnsonjo4531"}],frontMatter:{slug:"what-is-cursoring",title:"What is cursoring and pagination?",authors:["johnsonjo4531"],tags:["what","pagination","cursors","cursor","cursoring","paging"]},unlisted:!1,nextItem:{title:"Why would I want cursor based paging?",permalink:"/mongoose-relay-paginate/blog/why-cursor-based-paging"}},c={authorsImageUrls:[void 0]},l=[];function g(e){const o={code:"code",p:"p",pre:"pre",...(0,t.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(o.p,{children:"A cursor helps a server to find an item in a database."}),"\n",(0,a.jsx)(o.p,{children:"If you're not exactly sure what that means here's an analogy.\nIt's a lot like when you go to the library and have some information for\na specific book. This information you have about the book can help you locate it."}),"\n",(0,a.jsx)(o.p,{children:"A cursor (some information) can be turned into a database object (the book) by finding the first instance of it in the database (the library)."}),"\n",(0,a.jsx)(o.p,{children:"Below is a hypothetical example:"}),"\n",(0,a.jsx)(o.pre,{children:(0,a.jsx)(o.code,{children:'Cursor        -> Some query from a cursor -> DB Object\n{name: "bob"} -> Some query from a cursor -> {name: "bob", job: "something", location: "some place 123rd street"}\n'})}),"\n",(0,a.jsx)(o.p,{children:"An example of some query from a cursor, in MongoDB is:"}),"\n",(0,a.jsx)(o.pre,{children:(0,a.jsx)(o.code,{className:"language-js",children:'const {name, job, location} = await Employee.findOne({name: "bob"});\n'})}),"\n",(0,a.jsx)(o.p,{children:"A database object can be turned into a cursor with a transform of some sort in our case it will be provided by the user."}),"\n",(0,a.jsx)(o.p,{children:"Below is a hypothetical example:"}),"\n",(0,a.jsx)(o.pre,{children:(0,a.jsx)(o.code,{children:'DB Object -> some transform to a cursor -> Cursor\n{\n   name: "bob",\n   job: "something",\n   location: "some place 123rd street"\n}        -> some tranform to a cursor  -> {name: "bob"}\n'})})]})}function u(e={}){const{wrapper:o}={...(0,t.a)(),...e.components};return o?(0,a.jsx)(o,{...e,children:(0,a.jsx)(g,{...e})}):g(e)}},1151:(e,o,n)=>{n.d(o,{Z:()=>i,a:()=>s});var a=n(7294);const t={},r=a.createContext(t);function s(e){const o=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(o):{...o,...e}}),[o,e])}function i(e){let o;return o=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),a.createElement(r.Provider,{value:o},e.children)}}}]);