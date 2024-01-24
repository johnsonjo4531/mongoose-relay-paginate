import {
  RelayPaginateStatics,
  RelayPaginateQueryHelper,
  alterNodeOnResult,
  relayPaginate,
  relayPaginatePlugin,
  aggregateRelayPaginate,
} from "..";
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
type UserModel = Model<User, RelayPaginateQueryHelper> & RelayPaginateStatics;

// 3. Create a Schema corresponding to the document interface.
const schema = new Schema<User, UserModel>({
  myId: Number,
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

// 4. Create your Model.
const UserModel = model<User, UserModel>("User", schema); // 3. Create a Model.
const EmptyModel = model<User, UserModel>("Empty", schema);
const TrickyModel = model<User, UserModel>("Tricky", schema);

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
  const doc01 = new TrickyModel({
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
  const doc02 = new TrickyModel({
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
  await doc01.save();
  await doc2.save();
  await doc02.save();
  await doc3.save();
}

jest.setTimeout(10_000);
describe("relayPaginate", () => {
  beforeAll(async () => {
    await run();
  });

  afterAll(async () => {
    await UserModel.db.close();
  });

  it("should do at least do the query", async () => {
    const result = await relayPaginate(UserModel.find(), {});
    const newNodes = alterNodeOnResult(result, ({ myId }) => ({
      myId,
    })).nodes;
    expect(newNodes).toMatchObject([{ myId: 1 }, { myId: 2 }, { myId: 3 }]);
  });

  it("should use an after cursor properly", async () => {
    const result = await relayPaginate(UserModel.find().sort({ myId: "asc" }), {
      after: { myId: 1 },
    });

    expect(
      alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
    ).toMatchObject([{ myId: 2 }, { myId: 3 }]);
  });

  it("should work with first, last, and before", async () => {
    const result = await relayPaginate(UserModel.find().sort({ myId: "asc" }), {
      after: { myId: 1 },
      first: 1,
    });
    const result2 = await relayPaginate(
      UserModel.find().sort({ myId: "asc" }),
      {
        before: { myId: 3 },
        last: 1,
      }
    );
    const result3 = await relayPaginate(
      UserModel.find().sort({ myId: "asc" }),
      {
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
      after: { _id: firstUser._id },
      first: 2,
    });
    expect(
      alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
    ).toMatchObject([{ myId: 2 }, { myId: 3 }]);
  });

  it("should sort correctly", async () => {
    const result = await relayPaginate(UserModel.find().sort({ name: -1 }), {
      first: 1,
    });
    const result2 = await relayPaginate(UserModel.find().sort({ name: -1 }), {
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
      first: 1,
    });

    const result2 = await relayPaginate(UserModel.find().sort({ name: -1 }), {
      first: 1,
      after: result.pageInfo.endCursor,
    });

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Jill" }]);
  });

  it("should work the same when using global plugin", async () => {
    const result = await UserModel.find().sort({ name: -1 }).relayPaginate({
      first: 1,
    });

    const result2 = await UserModel.find().sort({ name: -1 }).relayPaginate({
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
      [{ $sort: { myId: 1 } }],
      {
        after: { myId: firstUser.myId },
        first: 2,
      }
    );

    expect(
      alterNodeOnResult(result, ({ myId }) => ({ myId })).nodes
    ).toMatchObject([{ myId: 2 }, { myId: 3 }]);
  });

  it("should aggregate with an after cursor and first", async () => {
    // [Phill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        first: 1,
      }
    );

    // [Bill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
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
        first: 1,
      }
    );

    // [Bill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        last: 1,
        after: result.pageInfo.endCursor,
      }
    );

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Bill" }]);
  });

  it("should aggregate with an after and first", async () => {
    // [Phill, Jill, Bill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        first: 1,
      }
    );

    // [Jill, Bill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        first: 2,
        after: result.pageInfo.endCursor,
      }
    );

    expect(
      alterNodeOnResult(result2, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Jill" }, { name: "Bill" }]);
  });

  it("should aggregate with an before, first, and last", async () => {
    // sorted as [Phill, Jill, Bill]
    // last is [Bill]
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        last: 1,
      }
    );

    // first 2 before Bill is [Phill, Jill]
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        first: 2,
        before: result.pageInfo.endCursor,
      }
    );

    // first 1 before Bill is [Phill]
    const result3 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        first: 1,
        before: result.pageInfo.endCursor,
      }
    );

    // last 1 before Bill is [Jill]
    const result4 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {
        last: 1,
        before: result.pageInfo.endCursor,
      }
    );

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

  it("should allow simple aggregate afterwards", async () => {
    // sorted as [Phill, Jill, Bill]
    const [{ count }] = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: -1 } }],
      {}
    )
      .toNodesAggregate<[{ count: number }]>()
      .count("count")
      .then();

    expect(count).toBe(3);
  });

  it("should allow getting pageInfo", async () => {
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    );

    const result = await await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    )
      .toNodesAggregate<[{ count: number }]>()
      .count("count");

    expect(result?.[0]?.count).toBe(3);
    expect(result2.pageInfo?.startCursor).toMatchObject({
      name: "Bill",
    });
    expect(result2.pageInfo?.endCursor).toMatchObject({
      name: "Phill",
    });
  });

  it("should skip getting pageInfo on aggregate", async () => {
    const result2 = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    );

    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    )
      .toNodesAggregate<[{ count: number }]>()
      .count("count");

    expect(result?.[0]?.count).toBe(3);
    expect(result2.pageInfo?.startCursor).toMatchObject({
      name: "Bill",
    });
    expect(result2.pageInfo?.endCursor).toMatchObject({
      name: "Phill",
    });
  });

  it("should allow getting nodes on aggregate", async () => {
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    );

    expect(
      alterNodeOnResult(result, ({ name }) => ({ name })).nodes
    ).toMatchObject([{ name: "Bill" }, { name: "Jill" }, { name: "Phill" }]);
  });

  it("should allow getting edges on aggregate", async () => {
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    );

    expect(
      alterNodeOnResult(result, ({ name }) => ({ name })).edges
    ).toMatchObject([
      { cursor: { name: "Bill" }, node: { name: "Bill" } },
      { cursor: { name: "Jill" }, node: { name: "Jill" } },
      { cursor: { name: "Phill" }, node: { name: "Phill" } },
    ]);
  });

  it("should allow getting edges on aggregate", async () => {
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {}
    );

    expect(
      alterNodeOnResult(result, ({ name }) => ({ name })).edges
    ).toMatchObject([
      { cursor: { name: "Bill" }, node: { name: "Bill" } },
      { cursor: { name: "Jill" }, node: { name: "Jill" } },
      { cursor: { name: "Phill" }, node: { name: "Phill" } },
    ]);
  });

  it("should allow getting edges on aggregate", async () => {
    const result = await UserModel.aggregateRelayPaginate([
      { $match: { name: "Bob" } },
    ]);

    expect(result).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("should properly compute nextPage prevPage on aggregate", async () => {
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {
        after: {
          name: "Bill",
        },
        first: 1,
      }
    );

    const nodes = [
      {
        name: "Jill",
      },
    ];
    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes,
      edges: nodes.map((x) => ({ node: x, cursor: x })),
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true,
        startCursor: nodes[0],
        endCursor: nodes[0],
      },
    });
  });

  it("should properly compute nextPage prevPage on non-aggregate", async () => {
    const result = await UserModel.find()
      .sort({ name: 1 })
      .relayPaginate({
        after: {
          name: "Bill",
        },
        first: 1,
      });

    const nodes = [
      {
        name: "Jill",
      },
    ];
    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes,
      edges: nodes.map((x) => ({ node: x, cursor: x })),
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true,
        startCursor: nodes[0],
        endCursor: nodes[0],
      },
    });
  });

  it("should properly compute prevPage false on aggregate", async () => {
    const result = await UserModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {
        before: {
          name: "Bill",
        },
        last: 1,
      }
    );

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  it("should properly compute prevPage false on non-aggregate", async () => {
    const result = await UserModel.find()
      .sort({ name: 1 })
      .relayPaginate({
        before: {
          name: "Bill",
        },
        first: 1,
      });

    ["Bill", "Jill", "Phill"];

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  it("should properly compute prevPage false with last on non-aggregate", async () => {
    const result = await UserModel.find()
      .sort({ name: 1 })
      .relayPaginate({
        before: {
          name: "Bill",
        },
        last: 1,
      });

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  it("should properly compute count based on filter criteria", async () => {
    const result = await UserModel.find({
      name: /^(B|J)/,
    })
      .sort({ name: 1 })
      .relayPaginate({
        first: 1,
      });

    const bill = {
      name: "Bill",
    };

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [bill],
      edges: [
        {
          cursor: bill,
          node: bill,
        },
      ],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: false,
      },
    });
  });

  it("should properly count zero items on non-aggregate", async () => {
    const result = await EmptyModel.find()
      .sort({ name: 1 })
      .relayPaginate({
        before: {
          name: "Bill",
        },
        first: 1,
      });

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("should properly count zero items on aggregate", async () => {
    const result = await EmptyModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {
        first: 1,
      }
    );

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("Empty Model with same before and after", async () => {
    const result = await EmptyModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {
        before: {
          name: "Jill",
        },
        after: {
          name: "Jill",
        },
        first: 1,
      }
    );

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });

  it("Tricky Model with no items, but valid before and after", async () => {
    const result = await TrickyModel.aggregateRelayPaginate(
      [{ $sort: { name: 1 } }],
      {
        before: {
          name: "Jill",
        },
        after: {
          name: "Jill",
        },
        first: 1,
      }
    );

    expect(alterNodeOnResult(result, ({ name }) => ({ name }))).toMatchObject({
      nodes: [],
      edges: [],
      pageInfo: {
        hasNextPage: true,
        hasPreviousPage: true,
      },
    });
  });
});
