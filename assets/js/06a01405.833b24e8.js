"use strict";(self.webpackChunkmongoose_relay_paginate=self.webpackChunkmongoose_relay_paginate||[]).push([[3191],{7634:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var s=n(5893),l=n(1151);const i={id:"RelayPaginateStatics",title:"Interface: RelayPaginateStatics",sidebar_label:"RelayPaginateStatics",sidebar_position:0,custom_edit_url:null},r=void 0,a={id:"api/interfaces/RelayPaginateStatics",title:"Interface: RelayPaginateStatics",description:"Example",source:"@site/docs/api/interfaces/RelayPaginateStatics.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/RelayPaginateStatics",permalink:"/mongoose-relay-paginate/docs/api/interfaces/RelayPaginateStatics",draft:!1,unlisted:!1,editUrl:null,tags:[],version:"current",sidebarPosition:0,frontMatter:{id:"RelayPaginateStatics",title:"Interface: RelayPaginateStatics",sidebar_label:"RelayPaginateStatics",sidebar_position:0,custom_edit_url:null},sidebar:"tutorialSidebar",previous:{title:"RelayPaginateQueryHelper",permalink:"/mongoose-relay-paginate/docs/api/interfaces/RelayPaginateQueryHelper"},next:{title:"RelayResult",permalink:"/mongoose-relay-paginate/docs/api/interfaces/RelayResult"}},d={},c=[{value:"Methods",id:"methods",level:2},{value:"aggregateRelayPaginate",id:"aggregaterelaypaginate",level:3},{value:"Type parameters",id:"type-parameters",level:4},{value:"Parameters",id:"parameters",level:4},{value:"Returns",id:"returns",level:4},{value:"Defined in",id:"defined-in",level:4}];function o(e){const t={a:"a",code:"code",h2:"h2",h3:"h3",h4:"h4",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,l.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.p,{children:(0,s.jsx)(t.strong,{children:(0,s.jsx)(t.code,{children:"Example"})})}),"\n",(0,s.jsx)(t.pre,{children:(0,s.jsx)(t.code,{className:"language-ts",children:'// 1. Create an interface representing a document in MongoDB.\ninterface User {\n _id: mongoose.Types.ObjectId;\n myId: number;\n name: string;\n email: string;\n avatar?: string;\n}\n\n// 2. Setup various types.\ntype UserModel = Model<User, RelayPaginateQueryHelper> & RelayPaginateStatics;\n\n// 3. Create a Schema corresponding to the document interface.\nconst schema = new Schema<User, UserModel>({\n myId: Number,\n name: { type: String, required: true },\n email: { type: String, required: true },\n avatar: String,\n});\n\n// 4. Create your Model.\nconst UserModel = model<User, UserModel>("User", schema);\n@public\n'})}),"\n",(0,s.jsx)(t.h2,{id:"methods",children:"Methods"}),"\n",(0,s.jsx)(t.h3,{id:"aggregaterelaypaginate",children:"aggregateRelayPaginate"}),"\n",(0,s.jsxs)(t.p,{children:["\u25b8 ",(0,s.jsx)(t.strong,{children:"aggregateRelayPaginate"}),"<",(0,s.jsx)(t.code,{children:"M"}),">(",(0,s.jsx)(t.code,{children:"this"}),", ",(0,s.jsx)(t.code,{children:"aggregate"}),", ",(0,s.jsx)(t.code,{children:"paginateInfo?"}),"): ",(0,s.jsx)(t.code,{children:"Object"})]}),"\n",(0,s.jsx)(t.p,{children:"This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format\nallows one to use cursor based pagination."}),"\n",(0,s.jsxs)(t.p,{children:["For more on cursors see ",(0,s.jsx)(t.a,{href:"/mongoose-relay-paginate/docs/api/modules#pagingcursor",children:"PagingCursor"})]}),"\n",(0,s.jsx)(t.p,{children:"For more info on using cursor based pagination algorithms like relay see:"}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://relay.dev/docs/guides/graphql-server-specification/",children:"the documentation for relay's connection spec"})," (look at this one for docs in more laymans terms),"]}),"\n",(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.a,{href:"https://relay.dev/graphql/connections.htm",children:"the actual relay spec"})," (look at this one for very exact and concise, but possibly confusing language),"]}),"\n",(0,s.jsx)(t.h4,{id:"type-parameters",children:"Type parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Name"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,s.jsx)(t.tbody,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"M"})}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["extends ",(0,s.jsx)(t.code,{children:"Model"}),"<",(0,s.jsx)(t.code,{children:"any"}),", ",", ",", ",", ",(0,s.jsx)(t.code,{children:"any"}),", ",(0,s.jsx)(t.code,{children:"any"}),", ",(0,s.jsx)(t.code,{children:"M"}),">"]})]})})]}),"\n",(0,s.jsx)(t.h4,{id:"parameters",children:"Parameters"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Name"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Description"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"this"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"M"})}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"the Model to add pagination through an aggregate to"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"aggregate"})}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"PipelineStage"}),"[]"]}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"-"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"paginateInfo?"})}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:[(0,s.jsx)(t.code,{children:"Partial"}),"<",(0,s.jsx)(t.code,{children:"MongooseRelayPaginateInfoOnModel"}),"<",(0,s.jsx)(t.code,{children:"ModelRawDocType"}),"<",(0,s.jsx)(t.code,{children:"M"}),">>>"]}),(0,s.jsx)(t.td,{style:{textAlign:"left"},children:"-"})]})]})]}),"\n",(0,s.jsx)(t.h4,{id:"returns",children:"Returns"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.code,{children:"Object"})}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Name"}),(0,s.jsx)(t.th,{style:{textAlign:"left"},children:"Type"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"then"})}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["<TResult1, TResult2>(",(0,s.jsx)(t.code,{children:"onfulfilled?"}),": ",(0,s.jsx)(t.code,{children:"null"})," | (",(0,s.jsx)(t.code,{children:"value"}),": ",(0,s.jsx)(t.a,{href:"/mongoose-relay-paginate/docs/api/interfaces/RelayResult",children:(0,s.jsx)(t.code,{children:"RelayResult"})}),"<",(0,s.jsx)(t.code,{children:"ModelRawDocType"}),"<",(0,s.jsx)(t.code,{children:"M"}),">[]>) => ",(0,s.jsx)(t.code,{children:"TResult1"})," | ",(0,s.jsx)(t.code,{children:"PromiseLike"}),"<",(0,s.jsx)(t.code,{children:"TResult1"}),">, ",(0,s.jsx)(t.code,{children:"onrejected?"}),": ",(0,s.jsx)(t.code,{children:"null"})," | (",(0,s.jsx)(t.code,{children:"reason"}),": ",(0,s.jsx)(t.code,{children:"any"}),") => ",(0,s.jsx)(t.code,{children:"TResult2"})," | ",(0,s.jsx)(t.code,{children:"PromiseLike"}),"<",(0,s.jsx)(t.code,{children:"TResult2"}),">) => ",(0,s.jsx)(t.code,{children:"Promise"}),"<",(0,s.jsx)(t.code,{children:"TResult1"})," | ",(0,s.jsx)(t.code,{children:"TResult2"}),">"]})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{style:{textAlign:"left"},children:(0,s.jsx)(t.code,{children:"toNodesAggregate"})}),(0,s.jsxs)(t.td,{style:{textAlign:"left"},children:["<AggregateResult>() => ",(0,s.jsx)(t.code,{children:"Aggregate"}),"<",(0,s.jsx)(t.code,{children:"AggregateResult"}),">"]})]})]})]}),"\n",(0,s.jsx)(t.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,s.jsx)(t.p,{children:(0,s.jsx)(t.a,{href:"https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L908",children:"src/index.ts:908"})})]})}function h(e={}){const{wrapper:t}={...(0,l.a)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(o,{...e})}):o(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>a,a:()=>r});var s=n(7294);const l={},i=s.createContext(l);function r(e){const t=s.useContext(i);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function a(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:r(e.components),s.createElement(i.Provider,{value:t},e.children)}}}]);