---
id: "modules"
title: "mongoose-relay-paginate"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Interfaces

- [PluginOptions](interfaces/PluginOptions.md)
- [RelayPaginateQueryHelper](interfaces/RelayPaginateQueryHelper.md)
- [RelayPaginateStatics](interfaces/RelayPaginateStatics.md)
- [RelayResult](interfaces/RelayResult.md)
- [TransformedRelayResult](interfaces/TransformedRelayResult.md)

## Type Aliases

### PagingCursor

Ƭ **PagingCursor**\<`DocType`\>: \{ [P in keyof DocType]?: DocType[P] \| null }

This is the default Cursor type for this project.

A cursor helps a server to find an item in a database.

If you're not exactly sure what that means here's an analogy.
Its a lot like when you go to the library and have some information for
a specific book. This information you have about the book can help you locate it.

A cursor (some information) can be turned into a database object (the book) by finding the first instance of
it in the database (the library).

Below is a hypothetical example:
```
Cursor        -> Some query from a cursor -> DB Object
{name: "bob"} -> Some query from a cursor -> {name: "bob", job: "something", location: "some place 123rd street"}
```

An example of some query from a cursor, in MongoDB is:

```js
const {name, job, location} = await Employee.findOne({name: "bob"});
```

A database object can be turned into a cursor with a transform of some sort in our case it will be provided by the user.

Below is a hypothetical example:
```
DB Object -> some transform to a cursor -> Cursor
{
   name: "bob",
   job: "something",
   location: "some place 123rd street"
}        -> some tranform to a cursor  -> {name: "bob"}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DocType` | `unknown` |

#### Defined in

[src/index.ts:200](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L200)

___

### PagingInfo

Ƭ **PagingInfo**\<`DocType`\>: `Object`

Info about how to page forward and backward

`first` and `last` are alot like limit in a typical skip and limit scheme.
This is because first and last signify how many elements to return.
You should never supply both `first` and `last` at the same time.
You should either supply one or the other, but not both.
Supplying both will lead to unpredicted behaviour.

`after` and `before` are more like the typical skip in skip and limit.
This is because after and before signify where the
collection starts and stops searching.
You may supply both the after and before, but your before cursor must be later
in your collection than your after cursor otherwise you will get 0 results.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `DocType` | `unknown` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `after?` | [`PagingCursor`](modules.md#pagingcursor)\<`DocType`\> \| ``null`` | fetch `after` the given record's cursor |
| `before?` | [`PagingCursor`](modules.md#pagingcursor)\<`DocType`\> \| ``null`` | fetch `before` the given record's cursor |
| `first?` | `number` | fetch the `first` given number of records |
| `last?` | `number` | fetch the `last` given number of records |

#### Defined in

[src/index.ts:221](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L221)

## Functions

### aggregateRelayPaginate

▸ **aggregateRelayPaginate**\<`T`\>(`model`, `aggregate`, `«destructured»?`): `Object`

This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
allows one to use cursor based pagination.

For more on cursors see [PagingCursor](modules.md#pagingcursor)

For more info on using cursor based pagination algorithms like relay see:

[the documentation for relay's connection spec](https://relay.dev/docs/guides/graphql-server-specification/) (look at this one for docs in more laymans terms),

[the actual relay spec](https://relay.dev/graphql/connections.htm) (look at this one for very exact and concise, but possibly confusing language),

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `model` | `Model`\<`T`, {}, {}, {}, `IfAny`\<`T`, `any`, `Document`\<`unknown`, {}, `T`\> & `Require_id`\<`T`\>\>, `any`\> |
| `aggregate` | `PipelineStage`[] |
| `«destructured»` | `MongooseRelayPaginateInfoOnModel`\<`T`\> |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `then` | `Aggregate`\<[`RelayResult`](interfaces/RelayResult.md)\<`T`[]\>\>[``"then"``] |
| `toNodesAggregate` | \<AggregateResult\>() => `Aggregate`\<`AggregateResult`\> |

#### Defined in

[src/index.ts:704](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L704)

___

### alterNodeOnResult

▸ **alterNodeOnResult**\<`Result`, `U`\>(`doc`, `transform`): [`TransformedRelayResult`](interfaces/TransformedRelayResult.md)\<`U`[], `Result`[]\>

Alters a relay connection to have a different nodeType for each node in the nodes and edges property.

#### Type parameters

| Name |
| :------ |
| `Result` |
| `U` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `doc` | [`RelayResult`](interfaces/RelayResult.md)\<`U`[]\> | the relay style connection document to alter |
| `transform` | (`doc`: `U`, `index?`: `number`, `arr?`: `U`[], `thisArg?`: `U`[]) => `Result` | a mapping transform to turn one thing into another |

#### Returns

[`TransformedRelayResult`](interfaces/TransformedRelayResult.md)\<`U`[], `Result`[]\>

An altered relay style connection with a new node type

#### Defined in

[src/index.ts:796](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L796)

___

### relayPaginate

▸ **relayPaginate**\<`T`\>(`query`, `paginationInfo?`): `QueryWithHelpers`\<`Promise`\<[`RelayResult`](interfaces/RelayResult.md)\<`MongooseRelayDocument`\<`DefaultRelayQuery`\<`T`\>\>[]\>\>, `QueryDocType`\<`DefaultRelayQuery`\<`T`\>\>, `QueryHelpers`\<`DefaultRelayQuery`\<`T`\>\>, `QueryRawDocType`\<`DefaultRelayQuery`\<`T`\>\>\>

This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
allows one to use cursor based pagination.

For more on cursors see [PagingCursor](modules.md#pagingcursor)

For more info on using cursor based pagination algorithms like relay see:

[the documentation for relay's connection spec](https://relay.dev/docs/guides/graphql-server-specification/) (look at this one for docs in more laymans terms),

[the actual relay spec](https://relay.dev/graphql/connections.htm) (look at this one for very exact and concise, but possibly confusing language),

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `query` | `Query`\<`T`[], `T`, `unknown`, `T`, ``"find"``\> | the query to add pagination to |
| `paginationInfo` | `MongooseRelayPaginateInfo`\<`Query`\<`T`[], `T`, `unknown`, `T`, ``"find"``\>\> | the information to help with the paging |

#### Returns

`QueryWithHelpers`\<`Promise`\<[`RelayResult`](interfaces/RelayResult.md)\<`MongooseRelayDocument`\<`DefaultRelayQuery`\<`T`\>\>[]\>\>, `QueryDocType`\<`DefaultRelayQuery`\<`T`\>\>, `QueryHelpers`\<`DefaultRelayQuery`\<`T`\>\>, `QueryRawDocType`\<`DefaultRelayQuery`\<`T`\>\>\>

#### Defined in

[src/index.ts:488](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L488)

___

### relayPaginatePlugin

▸ **relayPaginatePlugin**(`«destructured»?`): (`schema`: `Schema`\<`any`, `Model`\<`any`, `any`, `any`, `any`, `any`, `any`\>, {}, {}, {}, {}, `DefaultSchemaOptions`, {}, `Document`\<`unknown`, {}, `FlatRecord`\<{}\>\> & `FlatRecord`\<{}\> & `Required`\<\{ `_id`: `unknown`  }\>\>) => `void`

Creates the relay paginate plugin, so that you can use relayPaginate

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`PluginOptions`](interfaces/PluginOptions.md) |

#### Returns

`fn`

▸ (`schema`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `schema` | `Schema`\<`any`, `Model`\<`any`, `any`, `any`, `any`, `any`, `any`\>, {}, {}, {}, {}, `DefaultSchemaOptions`, {}, `Document`\<`unknown`, {}, `FlatRecord`\<{}\>\> & `FlatRecord`\<{}\> & `Required`\<\{ `_id`: `unknown`  }\>\> |

##### Returns

`void`

#### Defined in

[src/index.ts:936](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L936)

___

### relayResultFromNodes

▸ **relayResultFromNodes**\<`Node`\>(`cursorKeys`, `pagingInfo`, `nodes`): [`RelayResult`](interfaces/RelayResult.md)\<`Node`[]\>

Creates a typed relay connection. This is what relay uses for it's cursor-based pagination algorithm.
It can be constructed using three things: a set of documents called nodes, a transform that turns a document/node into a cursor,
and finally some metadata about paging which is called the `pagingInfo`.

#### Type parameters

| Name |
| :------ |
| `Node` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cursorKeys` | keyof `Node`[] | The way to turn a node into a cursor. Given certain props it will create a partial document node known as the cursor of the original document node with only those keys that are listed. For more info on cursors see [PagingCursor](modules.md#pagingcursor) |
| `pagingInfo` | `Pick`\<\{ `endCursor?`: ``null`` \| [`PagingCursor`](modules.md#pagingcursor)\<`Node`\> ; `hasNextPage`: `boolean` ; `hasPreviousPage`: `boolean` ; `startCursor?`: ``null`` \| [`PagingCursor`](modules.md#pagingcursor)\<`Node`\>  }, ``"hasNextPage"`` \| ``"hasPreviousPage"``\> | the metadata about paging information (such as cursors, number of documents returned, etc.) used by the client to gain some insight into the query and to more easily re-query and fetch the next and previous page. |
| `nodes` | `Node`[] | The nodes of the relay connection |

#### Returns

[`RelayResult`](interfaces/RelayResult.md)\<`Node`[]\>

A [RelayResult](interfaces/RelayResult.md)

#### Defined in

[src/index.ts:764](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L764)

___

### toCursorFromKeys

▸ **toCursorFromKeys**\<`Node`\>(`keys`, `doc`): `Partial`\<`Node`\>

#### Type parameters

| Name |
| :------ |
| `Node` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `keys` | keyof `Node`[] |
| `doc` | `Node` |

#### Returns

`Partial`\<`Node`\>

#### Defined in

[src/index.ts:741](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b343b43/src/index.ts#L741)
