# relayPaginate()

You'll need to import this package at the top of your entry file:

```ts
import "mongoose-relay-paginate";
```

Then you can use `.relayPaginate()` off of any mongoose query.

```ts
const result = await UserModel.find()
  // This is just the default mongoose sort
  .sort({ _id: -1 })
  // We can use the relayPaginate from this library off of any Query.
  .relayPaginate({
    cursorKeys: ["_id"],
    first: 1,
  });
```

`relayPaginate` takes in only one argument and that is its options  argument.

The only necessary part of relayPaginate option is the cursorKeys property you pass in. Abstractly `cursorKeys` is an array which defines what properties on the cursor for the specific query. The cursor defines a way that the specific item in a collection should be found. Say for example you have three user's with names: Bill, Jill, and Phill, which could be created like so.

```ts
const doc = new UserModel({
  name: "Bill",
  email: "bill@example.com",
  avatar: "https://i.imgur.com/dM7Thhn.png",
});

const doc2 = new UserModel({
  name: "Jill",
  email: "jill@example.com",
  avatar: "https://i.imgur.com/dM7Thhn.png",
});

const doc3 = new UserModel({
  name: "Phill",
  email: "Phill@example.com",
  avatar: "https://i.imgur.com/dM7Thhn.png",
});
await doc.save();
await doc2.save();
await doc3.save();
```

The `cursorKeys` here below select the user's name as the cursor. This means the before and after options, if provided, also have to fit this shape in order to return the proper output.

```ts
const result = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      // we allow the cursor to be the user's name
      cursorKeys: ["name"],
      // we get the first 2 items only
      first: 2,
      // We start getting results only after we have found bill's record
      after: {
        name: "Bill"
      }
    });
console.log(result.nodes); // Will be an array of Jill and then Phill's object
```

Generally you would want the cursor (represented by the `cursorKeys` prop, and the before and after options) to match whatever you are sorting by.
