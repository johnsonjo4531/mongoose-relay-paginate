"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[305],{4110:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>g,frontMatter:()=>i,metadata:()=>a,toc:()=>d});var r=t(5893),o=t(1151);const i={},s=void 0,a={id:"Changelog",title:"Changelog",description:"v4.0.0 to v5.0.0",source:"@site/docs/Changelog.md",sourceDirName:".",slug:"/Changelog",permalink:"/mongoose-relay-paginate/docs/Changelog",draft:!1,unlisted:!1,editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/docs/Changelog.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Paging with Cursors",permalink:"/mongoose-relay-paginate/docs/paging"},next:{title:"Compatibility",permalink:"/mongoose-relay-paginate/docs/compatibility"}},l={},d=[{value:"v4.0.0 to v5.0.0",id:"v400-to-v500",level:2},{value:"Registering the plugin",id:"registering-the-plugin",level:3},{value:"Sending in types",id:"sending-in-types",level:3}];function c(e){const n={code:"code",h2:"h2",h3:"h3",p:"p",pre:"pre",...(0,o.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"v400-to-v500",children:"v4.0.0 to v5.0.0"}),"\n",(0,r.jsx)(n.h3,{id:"registering-the-plugin",children:"Registering the plugin"}),"\n",(0,r.jsx)(n.p,{children:"v4 allowed this library to automatically register the global mongoose plugin you now have to do this yourself."}),"\n",(0,r.jsx)(n.p,{children:"v5 and after:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"// 0. Register the relay paginate plugins.\nplugin(\n  relayPaginatePlugin({\n    // Send in options\n    maxLimit: 100,\n  })\n);\n"})}),"\n",(0,r.jsx)(n.h3,{id:"sending-in-types",children:"Sending in types"}),"\n",(0,r.jsx)(n.p,{children:"Version 4 of this library tried to provide types for you out of the box, but version 5 now requires you to type your own models. This will make maintenance of this library less likely to break between many different changes to TypeScript types i.e. v5 will provide more future proof types."}),"\n",(0,r.jsx)(n.p,{children:"For v5.0.0 to get Mongoose to return the right types:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:'// 1. Create an interface representing a document in MongoDB.\ninterface User {\n  _id: mongoose.Types.ObjectId;\n  myId: number;\n  name: string;\n  email: string;\n  avatar?: string;\n}\n\n// 2. Setup various types.\ninterface UserQueryHelpers {}\n\ninterface UserMethods {}\n\ntype MyUserMethods = UserMethods;\n\ntype MyQueryHelpers = UserQueryHelpers & RelayPaginateQueryHelper;\n\ntype UserModel = Model<User, MyQueryHelpers, MyUserMethods> &\nRelayPaginateStatics;\n\n// 3. Create a Schema corresponding to the document interface.\nconst schema = new Schema<User, UserModel, MyUserMethods>({\n  myId: Number,\n  name: { type: String, required: true },\n  email: { type: String, required: true },\n  avatar: String,\n});\n\n// 4. Create your Model.\nconst UserModel = model<User, UserModel>("User", schema);\n'})})]})}function g(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(c,{...e})}):c(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>a,a:()=>s});var r=t(7294);const o={},i=r.createContext(o);function s(e){const n=r.useContext(i);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),r.createElement(i.Provider,{value:n},e.children)}}}]);