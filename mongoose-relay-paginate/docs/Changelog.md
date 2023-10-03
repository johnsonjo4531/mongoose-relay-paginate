
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
