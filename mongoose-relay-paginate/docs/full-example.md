---
sidebar_position: 3
---

# Full Example

```js
import { alterNodeOnResult, relayPaginate } from "..";
import { Schema, model, connect } from "mongoose";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
// Connection url
const url = "mongodb://localhost:32782";
// Database Name
const dbName = "mongo-relay-connection";

// 1. Create an interface representing a document in MongoDB.
interface User {
	myId: number;
	name: string;
	email: string;
	avatar?: string;
}

// 2. Create a Schema corresponding to the document interface.
const schema = new Schema<User>({
	myId: Number,
	name: { type: String, required: true },
	email: { type: String, required: true },
	avatar: String,
});

// 3. Create a Model.
const UserModel = model<User>("User", schema);

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
				cursorKeys: ["name"],
				first: 1,
			});

  console.log(result.nodes); // Will be any array of just Phill's object
}
```

