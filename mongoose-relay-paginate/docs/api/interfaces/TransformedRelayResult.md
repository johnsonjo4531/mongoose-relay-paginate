---
id: "TransformedRelayResult"
title: "Interface: TransformedRelayResult<OriginalNodes, NewNodes>"
sidebar_label: "TransformedRelayResult"
sidebar_position: 0
custom_edit_url: null
---

## Type parameters

| Name | Type |
| :------ | :------ |
| `OriginalNodes` | extends `unknown`[] |
| `NewNodes` | extends `unknown`[] |

## Properties

### edges

• **edges**: \{ `cursor`: [`PagingCursor`](../modules.md#pagingcursor)\<`ElementOfArray`\<`OriginalNodes`\>\> ; `node`: `ElementOfArray`\<`NewNodes`\>  }[]

#### Defined in

[src/index.ts:372](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L372)

___

### nodes

• **nodes**: `NewNodes`

#### Defined in

[src/index.ts:376](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L376)

___

### pageInfo

• **pageInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `endCursor?` | ``null`` \| [`PagingCursor`](../modules.md#pagingcursor)\<`ElementOfArray`\<`OriginalNodes`\>\> |
| `hasNextPage` | `boolean` |
| `hasPreviousPage` | `boolean` |
| `startCursor?` | ``null`` \| [`PagingCursor`](../modules.md#pagingcursor)\<`ElementOfArray`\<`OriginalNodes`\>\> |

#### Defined in

[src/index.ts:377](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L377)
