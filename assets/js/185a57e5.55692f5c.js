"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[5055],{8894:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>p,frontMatter:()=>r,metadata:()=>i,toc:()=>c});var a=t(5893),o=t(1151);const r={},s="Script Example",i={id:"examples/script-example",title:"Script Example",description:"",source:"@site/docs/examples/script-example.md",sourceDirName:"examples",slug:"/examples/script-example",permalink:"/mongoose-relay-paginate/docs/examples/script-example",draft:!1,unlisted:!1,editUrl:"https://github.com/johnsonjo4531/mongoose-relay-paginate/tree/main/packages/create-docusaurus/templates/shared/docs/examples/script-example.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"NestJS Example",permalink:"/mongoose-relay-paginate/docs/examples/nestjs"},next:{title:"Paging with Cursors",permalink:"/mongoose-relay-paginate/docs/paging"}},l={},c=[];function m(e){const n={code:"code",h1:"h1",pre:"pre",...(0,o.a)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"script-example",children:"Script Example"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-js",children:'import {\n  RelayPaginateStatics,\n  RelayPaginateQueryHelper,\n  alterNodeOnResult,\n  relayPaginate,\n  relayPaginatePlugin,\n} from "mongoose-relay-paginate";\nimport { Schema, model, connect, Model, plugin } from "mongoose";\nimport mongoose from "mongoose";\n// Connection url\nconst url = "mongodb://localhost:32782";\n// Database Name\nconst dbName = "mongo-relay-connection";\n\n// 0. Register the relay paginate plugins.\nplugin(\n  relayPaginatePlugin({\n    // Send in options\n    maxLimit: 100,\n  })\n);\n\n// 1. Create an interface representing a document in MongoDB.\ninterface User {\n  _id: mongoose.Types.ObjectId;\n  myId: number;\n  name: string;\n  email: string;\n  avatar?: string;\n}\n\n// 2. Setup various types.\ntype UserModel = Model<User, RelayPaginateQueryHelper> & RelayPaginateStatics;\n\n// 3. Create a Schema corresponding to the document interface.\nconst schema = new Schema<User, UserModel, MyUserMethods>({\n  myId: Number,\n  name: { type: String, required: true },\n  email: { type: String, required: true },\n  avatar: String,\n});\n\n// 4. Create your Model.\nconst UserModel = model<User, UserModel>("User", schema);\n\n\nasync function run(): Promise<void> {\n\t// 4. Connect to MongoDB\n\tconst client = await connect(url, {\n\t\tdbName,\n\t});\n\n\tconst doc = new UserModel({\n\t\tmyId: 1,\n\t\tname: "Bill",\n\t\temail: "bill@example.com",\n\t\tavatar: "https://i.imgur.com/dM7Thhn.png",\n\t});\n\n\tconst doc2 = new UserModel({\n\t\tmyId: 2,\n\t\tname: "Jill",\n\t\temail: "jill@example.com",\n\t\tavatar: "https://i.imgur.com/dM7Thhn.png",\n\t});\n\n\tconst doc3 = new UserModel({\n\t\tmyId: 3,\n\t\tname: "Phill",\n\t\temail: "Phill@example.com",\n\t\tavatar: "https://i.imgur.com/dM7Thhn.png",\n\t});\n\tawait doc.save();\n\tawait doc2.save();\n\tawait doc3.save();\n\n\n  const result = await UserModel.find()\n\t\t\t.sort({ name: -1 })\n\t\t\t.relayPaginate({\n\t\t\t\tfirst: 1,\n\t\t\t});\n\n  console.log(result.nodes); // Will be any array of just Phill\'s object\n}\n'})})]})}function p(e={}){const{wrapper:n}={...(0,o.a)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(m,{...e})}):m(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>i,a:()=>s});var a=t(7294);const o={},r=a.createContext(o);function s(e){const n=a.useContext(r);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),a.createElement(r.Provider,{value:n},e.children)}}}]);