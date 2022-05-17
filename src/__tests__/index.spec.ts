import { alterNodeOnResult, relayPaginate } from "..";
import { Schema, model, connect } from "mongoose";
import mongoose from "mongoose";
// Connection url
const url = "mongodb://localhost:32782";
// Database Name
const dbName = "mongo-relay-connection";

// 1. Create an interface representing a document in MongoDB.
interface User {
  _id: mongoose.Types.ObjectId;
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

describe("relayPaginate", () => {
  beforeAll(async () => {
    jest.setTimeout(10_000);
    await run();
  });

  afterAll(async () => {
    await UserModel.db.close();
  });

  it("should do at least do the query", async () => {
    const result = await relayPaginate(UserModel.find(), {
      cursorKeys: ["myId"],
    });
    const newNodes = alterNodeOnResult(result, ({ myId }) => ({
      myId,
    })).nodes;
    expect(newNodes).toMatchObject([{ myId: 1 }, { myId: 2 }, { myId: 3 }]);
  });

  it("should use an after cursor properly", async () => {
    const result = await relayPaginate(UserModel.find().sort({ myId: "asc" }), {
      cursorKeys: ["myId"],
      after: { myId: 1 },
    });

    expect(
      alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
    ).toMatchObject([{ myId: 2 }, { myId: 3 }]);
  });

  it("should work with first, last, and before", async () => {
    const result = await relayPaginate(UserModel.find().sort({ myId: "asc" }), {
      cursorKeys: ["myId"],
      after: { myId: 1 },
      first: 1,
    });
    const result2 = await relayPaginate(
      UserModel.find().sort({ myId: "asc" }),
      {
        cursorKeys: ["myId"],
        before: { myId: 3 },
        last: 1,
      }
    );
    const result3 = await relayPaginate(
      UserModel.find().sort({ myId: "asc" }),
      {
        cursorKeys: ["myId"],
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
      cursorKeys: ["_id"],
      after: { _id: firstUser._id },
      first: 2,
    });
    expect(
      alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
    ).toMatchObject([{ myId: 2 }, { myId: 3 }]);
  });

  it("should sort correctly", async () => {
    const result = await relayPaginate(UserModel.find().sort({ name: -1 }), {
      cursorKeys: ["name"],
      first: 1,
    });
    const result2 = await relayPaginate(UserModel.find().sort({ name: -1 }), {
      cursorKeys: ["name"],
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
      cursorKeys: ["name"],
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
      cursorKeys: ["name"],
      first: 1,
    });

    const result2 = await relayPaginate(UserModel.find().sort({ name: -1 }), {
      cursorKeys: ["name"],
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
        cursorKeys: ["name"],
        first: 1,
      });

    const result2 = await UserModel.find()
      .sort({ name: -1 })
      .relayPaginate({
        cursorKeys: ["name"],
        first: 1,
        after: result.pageInfo.endCursor,
      });

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Jill" }]);
  });

  it("should work with aggregation", async () => {
    const firstUser = await UserModel.findOne({ myId: 1 });
    if (!firstUser) throw new Error("No user unexpected test crash.");
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { _id: 1 } }],
      {
        cursorKeys: ["_id"],
        after: { _id: firstUser._id },
        first: 2,
      }
    );
    console.log({ result });
    expect(
      alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
    ).toMatchObject([{ myId: 2 }, { myId: 3 }]);
  });

  it("should aggregate with an after cursor and first", async () => {
    // [Phill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 1,
      }
    );

    // [Bill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 1,
        after: result.pageInfo.endCursor,
      }
    );

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Jill" }]);
  });

  it("should aggregate with an after and last", async () => {
    // [Phill, Jill, Bill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 1,
      }
    );

    // [Bill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        last: 1,
        after: result.pageInfo.endCursor,
      }
    );

    console.log({
      result1: alterNodeOnResult(result, ({ name }) => ({ name })).nodes,
      result2: alterNodeOnResult(result2, ({ name }) => ({ name })).nodes,
    });

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Bill" }]);
  });

  it("should aggregate with an after and first", async () => {
    // [Phill, Jill, Bill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 1,
      }
    );

    // [Jill, Bill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 2,
        after: result.pageInfo.endCursor,
      }
    );

    console.log({
      result1: alterNodeOnResult(result, ({ name }) => ({ name })).nodes,
      result2: alterNodeOnResult(result2, ({ name }) => ({ name })).nodes,
    });

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Jill" }, { name: "Bill" }]);
  });

  it("should count documents", async () => {
    // [Phill, Jill, Bill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 1,
      }
    );

    expect(result.pageInfo.count).toBe(3);
  });

  it("should aggregate with an before, first, and last", async () => {
    // sorted as [Phill, Jill, Bill]
    // last is [Bill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        last: 1,
      }
    );

    // first 2 before Bill is [Phill, Jill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 2,
        before: result.pageInfo.endCursor,
      }
    );

    // first 1 before Bill is [Phill]
    const result3 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 1,
        before: result.pageInfo.endCursor,
      }
    );

    // last 1 before Bill is [Jill]
    const result4 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        last: 1,
        before: result.pageInfo.endCursor,
      }
    );

    console.log({
      result1: alterNodeOnResult(result, ({ name }) => ({ name })).nodes,
      result2: alterNodeOnResult(result2, ({ name }) => ({ name })).nodes,
    });

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Phill" }, { name: "Jill" }]);

    expect(
      alterNodeOnResult(result3, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Phill" }]);

    expect(
      alterNodeOnResult(result4, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Jill" }]);
  });

  it("should allow you to aggregate afterwards", async () => {
    // sorted as [Phill, Jill, Bill]
    // last is [Bill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        last: 1,
      }
    );

    // first 2 before Bill is [Phill, Jill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 2,
        before: result.pageInfo.endCursor,
      }
    );

    // first 1 before Bill is [Phill]
    const result3 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        first: 1,
        before: result.pageInfo.endCursor,
      }
    );

    // last 1 before Bill is [Jill]
    const result4 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        cursorKeys: ["name"],
        last: 1,
        before: result.pageInfo.endCursor,
      }
    );

    console.log({
      result1: alterNodeOnResult(result, ({ name }) => ({ name })).nodes,
      result2: alterNodeOnResult(result2, ({ name }) => ({ name })).nodes,
    });

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Phill" }, { name: "Jill" }]);

    expect(
      alterNodeOnResult(result3, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Phill" }]);

    expect(
      alterNodeOnResult(result4, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Jill" }]);
  });
});
