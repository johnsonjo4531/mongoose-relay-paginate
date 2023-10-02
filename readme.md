<p align="center">
  <img src="./mongoose-relay-paginate/static/img/logo.png" />
</p>

## Compatible MongoDB versions

Your instance of MongoDB should be running version 4.4 or later. Your version of mongoose should be 7.5.1 or later

## Migration

### v4.0.0 to v5.0.0

#### Registering the plugin

v4 allowed this library to

#### Sending in types

Version 4 of this library tried to provide types for you out of the box, but version 5 now requires you to type your own models. This will make maintenance of this library less likely to break between many different changes to TypeScript types i.e. v5 will provide more future proof types.

For v5.0.0 to get Mongoose to return the right types

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
npm i mongoose-relay-paginate
```

Then you need to register the plugin sometime before you create your models see [mongoose's global plugins documentation](https://mongoosejs.com/docs/plugins.html#global
) for help:

```ts
import {plugin, Model, model, Schema } from "mongoose";
import {relayPaginatePlugin} from "mongoose-relay-paginate";

// 0. Register the relay paginate plugins.
plugin(
  relayPaginatePlugin({
    // Send in options
    maxLimit: 100,
  })
);

// 1. Create an interface representing a document in MongoDB.
interface User {
  _id: mongoose.Types.ObjectId;
  myId: number;
  name: string;
  email: string;
  avatar?: string;
}

// 2. Setup various types.
interface UserQueryHelpers {}

interface UserMethods {}

type MyUserMethods = UserMethods;

type MyQueryHelpers = UserQueryHelpers & RelayPaginateQueryHelper;

type UserModel = Model<User, MyQueryHelpers, MyUserMethods> &
  RelayPaginateStatics;

// 3. Create a Schema corresponding to the document interface.
const schema = new Schema<User, UserModel, MyUserMethods>({
  myId: Number,
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

// 4. Create your Model.
const UserModel = model<User, UserModel>("User", schema);
```

## Usage

Now the relayPaginate should be available on your model's mongoose queries, so you can use it as shown below.


```ts

const result = await UserModel.find()
  // sorting by id from largest (most recent)--> to smallest (most early) using mongoose's default sort.
  .sort({ _id: -1 })
  // This library's `relayPaginate` can now be used off your query
  // after the above setup.
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
