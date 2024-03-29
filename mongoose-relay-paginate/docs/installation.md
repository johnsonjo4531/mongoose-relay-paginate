---
sidebar_position: 2
---


# Installation

To use this library first install in your project, like so:

```bash
npm i mongoose-relay-paginate
```

Then you need to register the plugin sometime before you create your models see [mongoose's global plugins documentation](https://mongoosejs.com/docs/plugins.html#global) for help:

```ts
import { plugin, Model, model, Schema } from "mongoose";
import { relayPaginatePlugin, RelayPaginateQueryHelper, RelayPaginateStatics } from "mongoose-relay-paginate";

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
  .aggregateRelayPaginate([{ $sort: { _id: 1 } }], {
    first: 1,
  });
```

For more details view the [docs](https://johnsonjo4531.github.io/mongoose-relay-paginate/).
