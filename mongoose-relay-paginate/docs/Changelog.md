## v5.0.0 to v6.0.0

### API Breaking Changes

Due to performance reasons anything in this plugin that was dependant on getting Query.countDocuments() or Aggregate.count() (that includes the `$count` aggregation operator) for the whole pagination result had to be omitted. That includes:

- The `count` property in the `RelayResult`'s `pageInfo` which had to use a `Query.countDocuments()`.
- The `toAggregate` method returned from `aggregateRelayPaginate` which had to use an Aggregate `$count` operator

Sorry if you were dependant on this, but our team at work recently saw very bad performance issues due to the previous.

### Alternative solutions to the above

#### pageInfo.count

There is no alternative to the count property that this library used to provide. Also `count` was never spec compliant witht the Relay Connection spec, so it was likely a poor choice to begin with. You could always provide your own external solution to this, but do know that performance will likely be lackluster.

#### toAggregate

Though not the exact same there is now instead a `toNodesAggregate` method. Instead of returning the `RelayResult` it only returns `RelayResult[nodes]` i.e. just the nodes. The following two examples' `result`s are equivalent between the previous version's `toAggregate` and the new `toNodesAggregate`:

**toAggregate**
```ts
const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    )
      .toAggregate()
      .unwind("$nodes")
```

**toNodesAggregate**
```ts
const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    )
      .toNodesAggregate()
```


## v4.0.0 to v5.0.0

### Registering the plugin

v4 allowed this library to automatically register the global mongoose plugin you now have to do this yourself.

v5 and after:
```ts
// 0. Register the relay paginate plugins.
plugin(
  relayPaginatePlugin({
    // Send in options
    maxLimit: 100,
  })
);
```

### Sending in types

Version 4 of this library tried to provide types for you out of the box, but version 5 now requires you to type your own models. This will make maintenance of this library less likely to break between many different changes to TypeScript types i.e. v5 will provide more future proof types.

For v5.0.0 to get Mongoose to return the right types:

```ts
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
