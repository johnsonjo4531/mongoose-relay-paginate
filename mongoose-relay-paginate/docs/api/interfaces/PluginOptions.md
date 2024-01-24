---
id: "PluginOptions"
title: "Interface: PluginOptions"
sidebar_label: "PluginOptions"
sidebar_position: 0
custom_edit_url: null
---

Options for the relayPaginatePlugin

## Properties

### maxLimit

• `Optional` **maxLimit**: `number`

the maximum allowed limit for any query,
so that the client can't request over this
amount of items paged at a time.

**`Default`**

```ts
100
```

#### Defined in

[src/index.ts:931](https://github.com/johnsonjo4531/mongoose-relay-paginate/blob/b9e2a7f/src/index.ts#L931)
