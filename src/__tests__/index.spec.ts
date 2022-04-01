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

	await client.connection.db.dropDatabase();

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
}

describe("EdgesToReturn", () => {
	beforeAll(async () => {
		await run();
	});

	afterAll(async () => {
		await UserModel.db.close();
	});

	it("should do at least do the query", async () => {
		const result = await relayPaginate(UserModel.find(), {
			toCursor(doc) {
				return { myId: doc.myId };
			},
		});

		const newNodes = alterNodeOnResult(result, ({ myId }) => ({
			myId,
		})).nodes;
		expect(newNodes).toMatchObject([{ myId: 1 }, { myId: 2 }, { myId: 3 }]);
	});

	it("should use an after cursor properly", async () => {
		const result = await relayPaginate(UserModel.find().sort({ myId: "asc" }), {
			toCursor(doc) {
				return { myId: doc.myId };
			},
			after: { myId: 1 },
		});

		expect(
			alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
		).toMatchObject([{ myId: 2 }, { myId: 3 }]);
	});

	it("should work with first, last, and before", async () => {
		const result = await relayPaginate(UserModel.find().sort({ myId: "asc" }), {
			toCursor(doc) {
				return { myId: doc.myId };
			},
			after: { myId: 1 },
			first: 1,
		});
		const result2 = await relayPaginate(
			UserModel.find().sort({ myId: "asc" }),
			{
				toCursor(doc) {
					return { myId: doc.myId };
				},
				before: { myId: 3 },
				last: 1,
			}
		);
		const result3 = await relayPaginate(
			UserModel.find().sort({ myId: "asc" }),
			{
				toCursor(doc) {
					return { myId: doc.myId };
				},
				before: { myId: 3 },
				first: 1,
			}
		);
		expect(
			alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
		).toMatchObject([{ myId: 2 }]);
		expect(
			alterNodeOnResult(result2, ({ myId }) => ({ myId })).nodes
		).toMatchObject([{ myId: 2 }]);
		expect(
			alterNodeOnResult(result3, ({ myId }) => ({ myId })).nodes
		).toMatchObject([{ myId: 1 }]);
	});

	it("can use _id as a cursor key", async () => {
		const firstUser = await UserModel.findOne({ myId: 1 });
		if (!firstUser) throw new Error("No user unexpected test crash.");
		const result = await relayPaginate(UserModel.find().sort({ _id: "asc" }), {
			toCursor(doc) {
				return { _id: doc._id };
			},
			after: { _id: firstUser._id },
			first: 2,
		});
		expect(
			alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
		).toMatchObject([{ myId: 2 }, { myId: 3 }]);
	});

	it("should sort correctly", async () => {
		const result = await relayPaginate(UserModel.find().sort({ name: -1 }), {
			toCursor(doc) {
				return { name: doc.name };
			},
			first: 1,
		});
		const result2 = await relayPaginate(UserModel.find().sort({ name: -1 }), {
			toCursor(doc) {
				return { name: doc.name };
			},
			last: 1,
		});
		expect(
			alterNodeOnResult(result, ({ name }) => ({ name })).nodes[0].name
		).toBe("Phill");

		expect(
			alterNodeOnResult(result2, ({ name }) => ({ name })).nodes[0].name
		).toBe("Bill");
	});

	it("should make proper cursors", async () => {
		const result = await relayPaginate(UserModel.find().sort({ name: -1 }), {
			toCursor(doc) {
				return { name: doc.name };
			},
			first: 1,
		});

		expect(result.pageInfo.startCursor).toMatchObject({
			name: "Phill",
		});
		expect(result.pageInfo.startCursor).toMatchObject({
			name: "Phill",
		});
	});

	it("should paginate with a previous cursor from query", async () => {
		const result = await relayPaginate(UserModel.find().sort({ name: -1 }), {
			toCursor(doc) {
				return { name: doc.name };
			},
			first: 1,
		});

		const result2 = await relayPaginate(UserModel.find().sort({ name: -1 }), {
			toCursor(doc) {
				return { name: doc.name };
			},
			first: 1,
			after: result.pageInfo.endCursor,
		});

		expect(
			alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
		).toMatchObject([{ name: "Jill" }]);
	});

	it("should work the same when using global plugin", async () => {
		const result = await UserModel.find()
			.sort({ name: -1 })
			.relayPaginate({
				toCursor(doc) {
					return {
						name: doc.name,
					};
				},
				first: 1,
			});

		const result2 = await UserModel.find()
			.sort({ name: -1 })
			.relayPaginate({
				toCursor(doc) {
					return { name: doc.name };
				},
				first: 1,
				after: result.pageInfo.endCursor,
			});

		expect(
			alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
		).toMatchObject([{ name: "Jill" }]);
	});
});
