# aggregateRelayPaginate()

### released in v2.0.0

After following the [intro](../intro.md).

You can then use `.aggregateRelayPaginate()` off of any of the model's you setup.

```ts
const result = await UserModel.aggregateRelayPaginate(
  [{ $sort: { _id: -1 } }],
  {
    last: 1,
    before: result.pageInfo.endCursor,
  }
);
```

`aggregateRelayPaginate` takes in two arguments the first is its mongoose aggregation pipeline argument and the second is its relayPaginate options argument.

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

const result = await UserModel.aggregateRelayPaginate(
    [
      { $sort: { name: 1 } }
    ],
    {
      // we get the first 2 items only
      first: 2,
      // We start getting results only after we have found bill's record
      after: {
        name: "Bill"
      }
    });
console.log(result.nodes); // Will be an array of Jill and then Phill's object
```

Generally you would want the cursor (represented by your before and after options) to match whatever you are sorting by; a good default if you don't know what you are sorting by is to use the _id field as your cursor as it is the default sort field in mongodb, though this default is unnecessary in newer versions of the library.

Generally this is unnecessary to think about as both relayPaginates (aggregate and non-aggregate) should return to you start cursors and end cursors to paginate by in your before and after.

The before and after options, if provided, have to fit atleast the shape of the sort in order to return the proper output.

So if your sort was by `{ name: 1 }` the following would be good and bad examples.

```ts
// good after cursor since it includes name
{
  after: {
    name: "Bill"
  }
};
// still good after cursor since it includes name (though
// the email is unneccessary, it is both ignored and
// completely fine to send in.)
{
  after: {
    name: "Jill",
    email: "jill@example.com"
  }
};

// Bad example of an after cursor does not include a name...
// which is the field(s) to sort by.
{
  after: {
    email: "bill@example.com"
  }
};

// Good example of an after cursor as it again includes the name.
// Again it also ignores the email and avatar fields' as
// they aren't part of the sort.
{
  after: {
    name: "Bill",
    email: "bill@example.com",
    avatar: "https://i.imgur.com/dM7Thhn.png",
  }
};

// Good example of an after cursor as it again includes the name.
// Notice how this time the after cursor is a mixture of
// both Bill and Jill's information, but since the email is
// ignored Bill's record can still be found since it is only
// his information in the name field. Again it also ignores
// the email and avatar fields' as they aren't part of the sort.
{
  after: {
    name: "Bill",
    email: "jill@example.com",
    avatar: "https://i.imgur.com/dM7Thhn.png",
  }
};
```

All the above good examples should also work with the before cursors and the bad examples would not work with them.

If your sort was by `{ name: 1, email: 1 }` then you would have to include the name, and email field and values in the cursor fields for before and after.

