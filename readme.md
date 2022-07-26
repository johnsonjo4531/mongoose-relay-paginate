<p align="center">
  <img src="./mongoose-relay-paginate/static/img/logo.png" />
</p>

## Compatible MongoDB versions

Your instance of MongoDB should be running version 4.4 or later.

## Docs

View the [docs](https://johnsonjo4531.github.io/mongoose-relay-paginate/)

## What

This library is meant to allow cursor based pagination between the client and the server.

## Why

Because no existing pagination for mongoose that I can find was all of the following:

- Well tested
- Optimized
- Cursor based
- Relay Compatible

### FAQ

**Q** Doesn't MongoDB already have a built-in cursoring mechanism, why reinvent the wheel?

**A** Yes it does already have one, but that is meant to be used between the server and the database where as this library provides the cursoring/paging to be done between the client and the server.

## How

## Installation

To use this library first install in your project, like so:

```bash
yarn add mongoose-relay-paginate
```

Then you need to register the plugin by importing the library at the top of your entry file:

```ts
import "mongoose-relay-paginate"
```

## Usage

Now the relayPaginate should be available on your mongoose queries.


```ts

const result = await UserModel.find()
  // sorting by id from largest (most recent)--> to smallest (most early) using mongoose's default sort.
  .sort({ _id: -1 })
  // This library's `relayPaginate` can be used off of any mongoose query.
  .relayPaginate({
    first: 1,
  });
```

Or use an aggregate query off of your model:

```ts
const result = await UserModel
  // sorting by id from largest-->smallest using mongoose's default sort.
  .aggregateRelayPaginate(
    [{$sort: {_id: 1}}],
    {
    first: 1,
  });
```

The result will always come back in the form of:

```ts
type result = {
  nodes: UserModel[],
  edges: {
    node: UserModel,
    cursor: {
      // whatever fields were sorted on or just _id
    }
  },
  pageInfo: {
    count: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: {
      // whatever fields were sorted on or just _id
    };
    startCursor: {
      // whatever fields were sorted on or just _id
    };
  }
}
```

For more details view the [docs](https://johnsonjo4531.github.io/mongoose-relay-paginate/).
