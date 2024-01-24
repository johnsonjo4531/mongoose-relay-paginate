---
id: "RelayPaginateQueryHelper"
title: "Interface: RelayPaginateQueryHelper"
sidebar_label: "RelayPaginateQueryHelper"
sidebar_position: 0
custom_edit_url: null
---

**`Example`**

```ts
// 1. Create an interface representing a document in MongoDB.
interface User {
 _id: mongoose.Types.ObjectId;
 myId: number;
 name: string;
 email: string;
 avatar?: string;
}

// 2. Setup various types.
type UserModel = Model<User, RelayPaginateQueryHelper> & RelayPaginateStatics;

// 3. Create a Schema corresponding to the document interface.
const schema = new Schema<User, UserModel>({
 myId: Number,
 name: { type: String, required: true },
 email: { type: String, required: true },
 avatar: String,
});

// 4. Create your Model.
const UserModel = model<User, UserModel>("User", schema);

@public
```

## Methods

### relayPaginate

▸ **relayPaginate**\<`Q`\>(`this`, `paginateInfo?`): `Query`\<[`RelayResult`](RelayResult.md)\<`IfAny`\<`QueryResult`\<`Q`\>, `any`, `QueryDocType`\<`Q`\> extends `Record`\<`string`, `never`\> ? `Document`\<`unknown`, `QueryHelpers`\<`Q`\>, `QueryResult`\<`Q`\>\> & `Require_id`\<`QueryResult`\<`Q`\>\> : `IfAny`\<`QueryDocType`\<`Q`\>, `Document`\<`unknown`, `QueryHelpers`\<`Q`\>, `QueryResult`\<`Q`\>\> & `Require_id`\<`QueryResult`\<`Q`\>\>, `Document`\<`unknown`, `QueryHelpers`\<`Q`\>, `QueryResult`\<`Q`\>\> & `Omit`\<`Require_id`\<`QueryResult`\<`Q`\>\>, keyof `QueryDocType`\<`Q`\>\> & `QueryDocType`\<`Q`\>\>\>[]\>, `QueryDocType`\<`Q`\>, `QueryHelpers`\<`Q`\>, `QueryRawDocType`\<`Q`\>, ``"find"``\> & `QueryHelpers`\<`Q`\>

This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
allows one to use cursor based pagination.

For more on cursors see [PagingCursor](../modules.md#pagingcursor)

For more info on using cursor based pagination algorithms like relay see:

[the documentation for relay's connection spec](https://relay.dev/docs/guides/graphql-server-specification/) (look at this one for docs in more laymans terms),

[the actual relay spec](https://relay.dev/graphql/connections.htm) (look at this one for very exact and concise, but possibly confusing language),

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Q` | extends `Query`\<`unknown`[], `unknown`, `unknown`, `unknown`, ``"find"``, `Q`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `Q` | the query to add pagination to |
| `paginateInfo?` | `Partial`\<`MongooseRelayPaginateInfo`\<`Q`\>\> | - |

#### Returns

`Query`\<[`RelayResult`](RelayResult.md)\<`IfAny`\<`QueryResult`\<`Q`\>, `any`, `QueryDocType`\<`Q`\> extends `Record`\<`string`, `never`\> ? `Document`\<`unknown`, `QueryHelpers`\<`Q`\>, `QueryResult`\<`Q`\>\> & `Require_id`\<`QueryResult`\<`Q`\>\> : `IfAny`\<`QueryDocType`\<`Q`\>, `Document`\<`unknown`, `QueryHelpers`\<`Q`\>, `QueryResult`\<`Q`\>\> & `Require_id`\<`QueryResult`\<`Q`\>\>, `Document`\<`unknown`, `QueryHelpers`\<`Q`\>, `QueryResult`\<`Q`\>\> & `Omit`\<`Require_id`\<`QueryResult`\<`Q`\>\>, keyof `QueryDocType`\<`Q`\>\> & `QueryDocType`\<`Q`\>\>\>[]\>, `QueryDocType`\<`Q`\>, `QueryHelpers`\<`Q`\>, `QueryRawDocType`\<`Q`\>, ``"find"``\> & `QueryHelpers`\<`Q`\>

#### Defined in

[src/index.ts:855](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L855)
