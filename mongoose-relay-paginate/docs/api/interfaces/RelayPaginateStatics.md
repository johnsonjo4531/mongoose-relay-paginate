---
id: "RelayPaginateStatics"
title: "Interface: RelayPaginateStatics"
sidebar_label: "RelayPaginateStatics"
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

### aggregateRelayPaginate

▸ **aggregateRelayPaginate**\<`M`\>(`this`, `aggregate`, `paginateInfo?`): `Object`

This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
allows one to use cursor based pagination.

For more on cursors see [PagingCursor](../modules.md#pagingcursor)

For more info on using cursor based pagination algorithms like relay see:

[the documentation for relay's connection spec](https://relay.dev/docs/guides/graphql-server-specification/) (look at this one for docs in more laymans terms),

[the actual relay spec](https://relay.dev/graphql/connections.htm) (look at this one for very exact and concise, but possibly confusing language),

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | extends `Model`\<`any`, {}, {}, {}, `any`, `any`, `M`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | `M` | the Model to add pagination through an aggregate to |
| `aggregate` | `PipelineStage`[] | - |
| `paginateInfo?` | `Partial`\<`MongooseRelayPaginateInfoOnModel`\<`ModelRawDocType`\<`M`\>\>\> | - |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `then` | \<TResult1, TResult2\>(`onfulfilled?`: ``null`` \| (`value`: [`RelayResult`](RelayResult.md)\<`ModelRawDocType`\<`M`\>[]\>) => `TResult1` \| `PromiseLike`\<`TResult1`\>, `onrejected?`: ``null`` \| (`reason`: `any`) => `TResult2` \| `PromiseLike`\<`TResult2`\>) => `Promise`\<`TResult1` \| `TResult2`\> |
| `toNodesAggregate` | \<AggregateResult\>() => `Aggregate`\<`AggregateResult`\> |

#### Defined in

[src/index.ts:908](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L908)
