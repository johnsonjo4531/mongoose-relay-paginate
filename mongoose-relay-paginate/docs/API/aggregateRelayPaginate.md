# aggregateRelayPaginate()

### released in v2.0.0

You'll need to import this package at the top of your entry file:

```ts
import "mongoose-relay-paginate";
```

Then you can use `.aggregateRelayPaginate()` off of any mongoose Model.

```ts
const result = await UserModel.aggregateRelayPaginate(
  [{ $sort: { _id: -1 } }],
  {
    cusorKeys: ["_id"],
    last: 1,
    before: result.pageInfo.endCursor,
  }
);
```

`aggregateRelayPaginate` takes in two arguments the first is its mongoose aggregation pipeline argument and the second is its relayPaginate options argument.

The main necessary part of relayPaginate option is the cursorKeys option you pass in. `cursorKeys` is a chooses which keys are used in the cursor. The cursor defines a way that the specific item in a collection should be found. Say for example you have three user's with names: Bill, Jill, and Phill, which could be created like so.

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

The cursorKeys below will select the name as the cursor. This means the before and after options, if provided, also have to fit this shape in order to return the proper output.

```ts
const result = await UserModel.aggregateRelayPaginate(
    [
      { $sort: { name: 1 } }
    ],
    {
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

Generally you would want the cursor (represented by the values of the `cursorKeys` array, and the before and after options) to match whatever you are sorting by; a good default if you don't know what you are sorting by is to use the _id field as your cursor as it is the default sort field in mongodb, though this default is unnecessary in newer versions of the library.