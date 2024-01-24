---
id: "RelayResult"
title: "Interface: RelayResult<Nodes>"
sidebar_label: "RelayResult"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `Nodes` | extends `unknown`[] |

## Properties

### edges

• **edges**: \{ `cursor`: [`PagingCursor`](../modules.md#pagingcursor)\<`ElementOfArray`\<`Nodes`\>\> ; `node`: `ElementOfArray`\<`Nodes`\>  }[]

#### Defined in

[src/index.ts:355](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L355)

___

### nodes

• **nodes**: `Nodes`

#### Defined in

[src/index.ts:359](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L359)

___

### pageInfo

• **pageInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `endCursor?` | ``null`` \| [`PagingCursor`](../modules.md#pagingcursor)\<`ElementOfArray`\<`Nodes`\>\> |
| `hasNextPage` | `boolean` |
| `hasPreviousPage` | `boolean` |
| `startCursor?` | ``null`` \| [`PagingCursor`](../modules.md#pagingcursor)\<`ElementOfArray`\<`Nodes`\>\> |

#### Defined in

[src/index.ts:360](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L360)
