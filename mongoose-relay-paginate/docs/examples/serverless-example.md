# Serverless Example

```js
import {
  RelayPaginateStatics,
  RelayPaginateQueryHelper,
  alterNodeOnResult,
  relayPaginate,
  relayPaginatePlugin,
} from "mongoose-relay-paginate";
import { Schema, model, connect, Model, plugin } from "mongoose";
import mongoose from "mongoose";
// Connection url
const url = "mongodb://localhost:32782";
// Database Name
const dbName = "mongo-relay-connection";

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


async function run(): Promise<void> {
	// 4. Connect to MongoDB
	const client = await connect(url, {
		dbName,
	});

	const doc = new UserModel({
		myId: 1,
		name: "Bill",
		email: "bill@example.com",
		avatar: "https://i.imgur.com/dM7Thhn.png",
	});

	const doc2 = new UserModel({
		myId: 2,
		name: "Jill",
		email: "jill@example.com",
		avatar: "https://i.imgur.com/dM7Thhn.png",
	});

	const doc3 = new UserModel({
		myId: 3,
		name: "Phill",
		email: "Phill@example.com",
		avatar: "https://i.imgur.com/dM7Thhn.png",
	});
	await doc.save();
	await doc2.save();
	await doc3.save();


  const result = await UserModel.find()
			.sort({ name: -1 })
			.relayPaginate({
				first: 1,
			});

  console.log(result.nodes); // Will be any array of just Phill's object
}
```

