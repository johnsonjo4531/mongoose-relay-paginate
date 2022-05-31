import mongoose, {
  Query as MongooseQuery,
  Document,
  plugin,
  Schema,
  Model,
  Aggregate,
  QueryOptions,
  PipelineStage,
  Types,
} from "mongoose";
const DEFAULT_LIMIT = 100;

/** A default query used throughout this file to help our mongoose queries have an expected structure
 * that the relay specification relies on.
 */
type DefaultRelayQuery<T = unknown> = MongooseQuery<
  T[],
  unknown,
  unknown,
  Document
>;

/** A mock query structure for our defaultRelayQuery that can play back commands as either an aggregate or
 * a query.
 */
class AggregateOrQueryCommandReplayer<T> {
  commands: (
    | { type: "sort"; args: Parameters<DefaultRelayQuery<T>["sort"]> }
    | { type: "limit"; args: Parameters<DefaultRelayQuery<T>["limit"]> }
    | { type: "find"; args: Parameters<DefaultRelayQuery<T>["find"]> }
    | {
        type: "aggregate";
        args: [pipeline: PipelineStage.FacetPipelineStage[]];
      }
  )[] = [];

  sort(...args: Parameters<DefaultRelayQuery<T>["sort"]>) {
    this.commands.push({
      type: "sort",
      args,
    });
  }

  aggregate(...args: [pipeline: PipelineStage.FacetPipelineStage[]]) {
    this.commands.push({
      type: "aggregate",
      args,
    });
  }

  limit(...args: Parameters<DefaultRelayQuery<T>["limit"]>) {
    this.commands.push({
      type: "limit",
      args,
    });
  }

  find(...args: Parameters<DefaultRelayQuery<T>["find"]>) {
    this.commands.push({
      type: "find",
      args,
    });
  }

  toUserDefinedAggregate(
    model: Model<T>,
    regularAggregate: PipelineStage[]
  ): Aggregate<T[]> {
    return model.aggregate<T>([...regularAggregate]);
  }

  toLimitlessAggregate(
    model: Model<T>,
    regularAggregate: PipelineStage[],
    additionalAggregates: PipelineStage[] = []
  ): Aggregate<T[]> {
    const stages: PipelineStage[] = this.commands
      .filter(
        (x): x is Exclude<typeof x, { type: "limit" }> => x.type !== "limit"
      )
      .flatMap((x): PipelineStage | PipelineStage[] =>
        x.type === "find"
          ? {
              $match: x.args[0],
            }
          : x.type === "aggregate"
          ? x.args[0]
          : {
              $sort: x.args[0],
            }
      );
    return model.aggregate<T>([
      ...regularAggregate,
      ...stages,
      ...additionalAggregates,
    ]);
  }

  toAggregate(
    model: Model<T>,
    regularAggregate: PipelineStage[],
    additionalAggregates: PipelineStage[] = []
  ): Aggregate<T[]> {
    const stages: PipelineStage[] = this.currentCommandsAsFacetPipelineStages();
    return model.aggregate<T>([
      ...regularAggregate,
      ...stages,
      ...additionalAggregates,
    ]);
  }

  currentCommands() {
    return this.commands;
  }

  currentCommandsAsFacetPipelineStages(): PipelineStage.FacetPipelineStage[] {
    return this.commands.flatMap(
      (
        x
      ):
        | PipelineStage.FacetPipelineStage
        | PipelineStage.FacetPipelineStage[] =>
        x.type === "find"
          ? {
              $match: x.args[0],
            }
          : x.type === "aggregate"
          ? x.args[0]
          : x.type === "limit"
          ? { $limit: x.args[0] }
          : {
              $sort: x.args[0],
            }
    );
  }

  toQuery(query: DefaultRelayQuery<T>): DefaultRelayQuery<T> {
    return this.commands
      .filter(
        (x): x is Exclude<typeof x, { type: "aggregate" }> =>
          x.type !== "aggregate"
      )
      .reduce((query, { type, args }) => {
        return (query[type] as CallableFunction)(...args);
      }, query);
  }
}
type DefaultInnerRelayQuery<T = unknown> = AggregateOrQueryCommandReplayer<T>;

/** This is the default Cursor type for this project.
 *
 * A cursor helps a server to find an item in a database.
 *
 * If you're not exactly sure what that means here's an analogy.
 * Its a lot like when you go to the library and have some information for
 * a specific book. This information you have about the book can help you locate it.
 *
 * A cursor (some information) can be turned into a database object (the book) by finding the first instance of
 * it in the database (the library).
 *
 * Below is a hypothetical example:
 * ```
 * Cursor        -> Some query from a cursor -> DB Object
 * {name: "bob"} -> Some query from a cursor -> {name: "bob", job: "something", location: "some place 123rd street"}
 * ```
 *
 * An example of some query from a cursor, in MongoDB is:
 *
 * ```js
 * const {name, job, location} = await Employee.findOne({name: "bob"});
 * ```
 *
 * A database object can be turned into a cursor with a transform of some sort in our case it will be provided by the user.
 *
 * Below is a hypothetical example:
 * ```
 * DB Object -> some transform to a cursor -> Cursor
 * {
 *    name: "bob",
 *    job: "something",
 *    location: "some place 123rd street"
 * }        -> some tranform to a cursor  -> {name: "bob"}
 * ```
 *
 * an example of how one would make this transform in particular the way this library does it through its cursorKeys option:
 *
 * @public
 */
export type PagingCursor<DocType = unknown> = Partial<DocType>;

/** Info about how to page forward and backward
 * @public
 */
export type PagingInfo<DocType = unknown> = {
  first?: number;
  last?: number;
  after?: PagingCursor<DocType> | null;
  before?: PagingCursor<DocType> | null;
};

/** This algorithm is modified from the graphql-relay-specification.
 *
 * for more info see either:
 *
 * {@link https://relay.dev/docs/guides/graphql-server-specification/#connections  the documentation for relay relevant to connections} (documentation is generally a bit friendlier in wording), or
 * {@link https://relay.dev/graphql/connections.htm#ApplyCursorsToEdges()  the relay connection specification} (specs are generally in more specific and esoteric terms)
 */
const edgesToReturn = function EdgesToReturn<
  T,
  Cursor extends PagingCursor = PagingCursor
>(
  query: DefaultInnerRelayQuery<T>,
  { before, after, first, last }: PagingInfo<Cursor>,
  { originalSort }: { originalSort: QueryOptions["sort"] }
): DefaultInnerRelayQuery<T> {
  const edges = applyCursorsToEdges(query, originalSort, before, after);
  // Let edges be the result of calling ApplyCursorsToEdges(allEdges, before, after).
  // If first is set:
  edges.limit(DEFAULT_LIMIT);
  if (typeof first !== "undefined" && first !== null && !Number.isNaN(first)) {
    // If first is less than 0:
    if (first < 0) {
      // Throw an error.
      throw new Error("`first` must be a positive number.");
    }
    // If edges has length greater than than first:
    // Slice edges to be of length first by removing edges from the end of edges.
    edges.limit(first);
  }
  // If last is set:
  if (typeof last !== "undefined" && last !== null && !Number.isNaN(last)) {
    // If last is less than 0:
    if (last < 0) {
      // Throw an error.
      throw new Error("`last` must be a positive number.");
    }
    // If edges has length greater than than last:
    // Slice edges to be of length last by removing edges from the start of edges.
    // _id:
    // console.log(
    //   JSON.stringify({ originalSort }, null, 2),
    //   Object.fromEntries(
    //     Object.entries(originalSort).map(([key, value]) => [
    //       key,
    //       typeof value === "number" ? (value >= 0 ? -1 : 1) : 1,
    //     ])
    //   )
    // );
    edges.sort(
      Object.fromEntries(
        Object.entries(originalSort).map(([key, value]) => [
          key,
          typeof value === "number" ? (value >= 0 ? -1 : 1) : null,
        ])
      )
    );
    edges.limit(last);
  }
  return edges;
  // Return edges.
};

/** The applyCursorsToEdges function applies the cursor to the edges that are returned in more concrete terms it
 * takes the cursor information and decides what items should be returned from the database.
 *
 * The cursors determine where in a collection a particular item is. Every item in the database can be turned to a cursor.
 * Every cursor can then be turned backed to an item. For more info see {@link PagingCursor}.
 *
 */
const applyCursorsToEdges = <T, MyCursor extends PagingCursor = PagingCursor>(
  allEdges: DefaultInnerRelayQuery<T>,
  originalSort: QueryOptions["sort"],
  before?: MyCursor | null | undefined,
  after?: MyCursor | null | undefined
) => {
  // Initialize edges to be allEdges.
  const edges = allEdges;
  const sortBy = originalSort;
  // If after is set:
  if (after) {
    // Let afterEdge be the edge in edges whose cursor is equal to the after argument.
    // Remove all elements of edges before and including afterEdge.
    Object.entries(after).forEach(([key, value]) => {
      edges.find({
        [key]:
          !sortBy || (sortBy?.[key] as number) === 1
            ? { $gt: value }
            : { $lt: value },
        // if sort is ascending: 0 (after: 0) --->, 1, 2, 3, 4, 5
        // if sort is descending: 5 (after: 5) --->, 4, 3, 2, 1, 0
      });
    });
  }
  // If before is set:
  if (before) {
    // Let beforeEdge be the edge in edges whose cursor is equal to the before argument.
    // If beforeEdge exists:
    // Remove all elements of edges after and including beforeEdge.
    Object.entries(before).forEach(([key, value]) => {
      edges.find({
        [key]:
          (!sortBy as boolean) || (sortBy?.[key] as number) === 1
            ? { $lt: value }
            : { $gt: value },
      });
      // if sort is ascending: 0, 1, 2, 3, 4, <--- (before: 5) 5
      // if sort is descending: 5, 4, 3, 2, 1, <--- (before: 0) 0
    });
  }
  // Return edges.
  return edges;
};

type ElementOfArray<Array extends unknown[]> = Array extends (infer T)[]
  ? T
  : never;

type UnwrapArray<MaybeArray> = MaybeArray extends (infer T)[] ? T : MaybeArray;
export interface RelayResult<Nodes extends unknown[]> {
  edges: {
    node: ElementOfArray<Nodes>;
    cursor: PagingCursor<ElementOfArray<Nodes>>;
  }[];
  nodes: Nodes;
  pageInfo: {
    count: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor?: PagingCursor<ElementOfArray<Nodes>> | null;
    startCursor?: PagingCursor<ElementOfArray<Nodes>> | null;
  };
}

export interface TransformedRelayResult<
  OriginalNodes extends unknown[],
  NewNodes extends unknown[]
> {
  edges: {
    node: ElementOfArray<NewNodes>;
    cursor: PagingCursor<ElementOfArray<OriginalNodes>>;
  }[];
  nodes: NewNodes;
  pageInfo: {
    count: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor?: PagingCursor<ElementOfArray<OriginalNodes>> | null;
    startCursor?: PagingCursor<ElementOfArray<OriginalNodes>> | null;
  };
}

/** A helper generic type which when given a DefaultRelayQuery will infer its RawDocType */
type QueryRawDocType<Q extends DefaultRelayQuery> = Q extends MongooseQuery<
  unknown,
  unknown,
  unknown,
  infer RawDocType
>
  ? RawDocType
  : never;

/** A helper generic type which when given a DefaultRelayQuery will infer the DocType */
type QueryDocType<Q extends DefaultRelayQuery> = Q extends MongooseQuery<
  unknown,
  infer DocType,
  unknown,
  unknown
>
  ? DocType
  : never;

/** A helper generic type which when given a DefaultRelayQuery will infer its QueryHelpers */
type QueryHelpers<Q extends DefaultRelayQuery> = Q extends MongooseQuery<
  unknown,
  unknown,
  infer QueryHelpers,
  unknown
>
  ? QueryHelpers
  : never;

/** A helper generic type which when given a DefaultRelayQuery will infer the QueryResult */
type QueryResult<Q extends DefaultRelayQuery> = Q extends MongooseQuery<
  infer QueryResult,
  unknown,
  unknown,
  unknown
>
  ? QueryResult
  : never;

/** A helper generic type which when given a {@link DefaultRelayQuery} will construct its corresponding document node that will be part of the return type of {@link relayPaginate}. */
type MongooseRelayDocument<Q extends DefaultRelayQuery> = Document<
  QueryResult<Q>,
  QueryHelpers<Q>,
  QueryDocType<Q>
> &
  QueryRawDocType<Q>;

/** A helper generic type which when given a {@link DefaultRelayQuery} and {@link PagingCursor} construct its corresponding `cursorKeys` type. */
type MongooseRelayPaginateInfo<Q extends DefaultRelayQuery> =
  MongooseRelayPaginateInfoOnModel<
    Q extends MongooseQuery<unknown, unknown, unknown, infer DocType>
      ? DocType
      : never
  >;

/** A helper generic type which when given a {@link Model} and {@link PagingCursor} construct its corresponding `cursorKeys` type. */
type MongooseRelayPaginateInfoOnModel<D> = PagingInfo<D>; // | UnwrapArray<D> extends Document<unknown, unknown, infer G> ? G : never

/** This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
 * allows one to use cursor based pagination.
 *
 * For more on cursors see {@link PagingCursor}
 *
 * For more info on using cursor based pagination algorithms like relay see:
 *
 * {@link https://relay.dev/docs/guides/graphql-server-specification/  the documentation for relay's connection spec} (look at this one for docs in more laymans terms),
 *
 * {@link https://relay.dev/graphql/connections.htm  the actual relay spec} (look at this one for very exact and concise, but possibly confusing language),
 *
 * @param query the query to add pagination to
 * @param paginationInfo the information to help with the paging
 * @returns
 */
export function relayPaginate<Q extends DefaultRelayQuery>(
  query: Q,
  { ...pagingInfo }: MongooseRelayPaginateInfo<Q> = {}
): MongooseQuery<
  Promise<RelayResult<MongooseRelayDocument<Q>[]>>,
  QueryDocType<Q>,
  QueryHelpers<Q>,
  QueryRawDocType<Q>
> &
  QueryHelpers<Q> {
  const pseudoQuery = new AggregateOrQueryCommandReplayer();
  const originalSort = query.getOptions().sort ?? {
    _id: 1,
  };
  edgesToReturn(pseudoQuery, pagingInfo, {
    originalSort,
  });
  const finalQuery = pseudoQuery.toQuery(query.clone());
  return finalQuery.transform<Promise<RelayResult<MongooseRelayDocument<Q>[]>>>(
    async (_nodes) => {
      const nodes = _nodes as unknown as MongooseRelayDocument<Q>[];
      const beforeAfterCount =
        (pagingInfo.before ? 1 : 0) + (pagingInfo.after ? 1 : 0);
      const [{ count, hasNextPage, hasPreviousPage }] = await query.model
        .aggregate<{
          count: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
        }>([{ $match: query.getFilter() }])
        .facet({
          count: [{ $count: "count" }],
          ends: [
            {
              $sort: originalSort,
            },
            {
              $group: {
                _id: null,
                first: { $first: "$$ROOT" },
                last: { $last: "$$ROOT" },
              },
            },
          ],
        })
        .unwind({ path: "$count", preserveNullAndEmptyArrays: true })
        .unwind({ path: "$ends", preserveNullAndEmptyArrays: true })
        .replaceRoot({
          count: { $cond: ["$count.count", "$count.count", 0] },
          hasNextPage: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      { $eq: [!!pagingInfo.before, true] },
                      { $gte: ["$count", beforeAfterCount] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: [{ $type: "$ends.last._id" }, "objectId"] },
                      { $gt: [nodes.length, 0] },
                      {
                        $cond: [
                          {
                            $in: ["$ends.last._id", nodes.map((x) => x._id)],
                          },
                          false,
                          true,
                        ],
                      },
                    ],
                  },
                ],
              },
              true,
              false,
            ],
          },
          hasPreviousPage: {
            $cond: [
              {
                $or: [
                  {
                    $and: [
                      { $eq: [!!pagingInfo.after, true] },
                      { $gte: ["$count", beforeAfterCount] },
                    ],
                  },
                  {
                    $and: [
                      { $eq: [{ $type: "$ends.first._id" }, "objectId"] },
                      { $gt: [nodes.length, 0] },
                      {
                        $cond: [
                          {
                            $in: ["$ends.first._id", nodes.map((x) => x._id)],
                          },
                          false,
                          true,
                        ],
                      },
                    ],
                  },
                ],
              },
              true,
              false,
            ],
          },
        });
      //     startCursor: { $first: "$nodes" },
      //     endCursor: { $last: "$nodes" },
      //   },
      // });

      return relayResultFromNodes(
        Object.keys(originalSort) as any,
        {
          count: count ?? 0,
          hasNextPage,
          // Boolean(pagingInfo.before) ||
          // (nodes.length > 0 &&
          //   ends?.last?._id instanceof Types.ObjectId &&
          //   !(nodes as { _id: Types.ObjectId }[]).some(
          //     (node) => node._id?.equals(ends.last?._id ?? "") ?? false
          //   )),
          hasPreviousPage,
          // :
          // Boolean(pagingInfo.after) ||
          // (nodes.length > 0 &&
          //   ends?.first?._id instanceof Types.ObjectId &&
          //   !(nodes as { _id: Types.ObjectId }[]).some(
          //     (node: { _id: undefined | Types.ObjectId }) =>
          //       node._id?.equals(ends.first?._id ?? "") ?? false
          //   )),
        },
        nodes as MongooseRelayDocument<Q>[]
      );
    }
  ) as MongooseQuery<
    Promise<RelayResult<MongooseRelayDocument<Q>[]>>,
    QueryDocType<Q>,
    QueryHelpers<Q>,
    QueryRawDocType<Q>
  > &
    QueryHelpers<Q>;
}

/** This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
 * allows one to use cursor based pagination.
 *
 * For more on cursors see {@link PagingCursor}
 *
 * For more info on using cursor based pagination algorithms like relay see:
 *
 * {@link https://relay.dev/docs/guides/graphql-server-specification/  the documentation for relay's connection spec} (look at this one for docs in more laymans terms),
 *
 * {@link https://relay.dev/graphql/connections.htm  the actual relay spec} (look at this one for very exact and concise, but possibly confusing language),
 *
 * @param Model the model to add pagination to
 * @param paginationInfo the information to help with the paging
 * @returns
 */
export function aggregateRelayPaginate<T>(
  model: Model<T>,
  aggregate: PipelineStage[],
  { ...pagingInfo }: MongooseRelayPaginateInfoOnModel<T> = {}
): {
  toAggregate: () => Aggregate<[RelayResult<T[]>]>;
  then: Aggregate<RelayResult<T[]>>["then"];
} {
  const pseudoQuery = new AggregateOrQueryCommandReplayer<T>();
  const originalSort: PipelineStage.Sort["$sort"] = [...aggregate]
    .reverse()
    .find((x): x is PipelineStage.Sort => !!(x as any)?.["$sort"])?.[
    "$sort"
  ] ?? {
    _id: 1,
  };
  edgesToReturn(pseudoQuery, pagingInfo, {
    originalSort,
  });
  const nodes: Aggregate<[RelayResult<T[]>]> =
    pseudoQuery.toUserDefinedAggregate(
      model,
      aggregate
    ) as unknown as Aggregate<[RelayResult<T[]>]>;
  // We have to take the commands and put them in a facet?
  // I'd rather not have them in a facet cause you can't put facets within facets, and other
  // various pipelines also don't work.
  //
  nodes.facet({
    count: [{ $count: "count" }],
    nodes: [
      ...pseudoQuery.currentCommandsAsFacetPipelineStages(),
      {
        $sort: originalSort,
      },
    ],
    ends: [
      {
        $sort: originalSort,
      },
      {
        $group: {
          _id: null,
          first: { $first: "$$ROOT" },
          last: { $last: "$$ROOT" },
        },
      },
    ],
  });
  nodes.unwind({ path: "$count", preserveNullAndEmptyArrays: true });
  nodes.unwind({ path: "$ends", preserveNullAndEmptyArrays: true });
  const beforeAfterCount =
    (pagingInfo.before ? 1 : 0) + (pagingInfo.after ? 1 : 0);
  nodes.replaceRoot({
    nodes: "$nodes",
    edges: {
      $map: {
        input: "$nodes",
        as: "node",
        in: {
          node: "$$node",
          cursor: "$$node",
        },
      },
    },
    pageInfo: {
      count: { $cond: ["$count.count", "$count.count", 0] },
      hasNextPage: {
        $cond: [
          {
            $or: [
              {
                $and: [
                  { $eq: [!!pagingInfo.before, true] },
                  { $gte: ["$count", beforeAfterCount] },
                ],
              },
              {
                $and: [
                  { $eq: [{ $type: "$ends.last._id" }, "objectId"] },
                  { $gt: [{ $size: "$nodes" }, 0] },
                  {
                    $cond: [
                      {
                        $in: ["$ends.last._id", "$nodes._id"],
                      },
                      false,
                      true,
                    ],
                  },
                ],
              },
            ],
          },
          true,
          false,
        ],
      },
      hasPreviousPage: {
        $cond: [
          {
            $or: [
              {
                $and: [
                  { $eq: [!!pagingInfo.after, true] },
                  { $gte: ["$count", beforeAfterCount] },
                ],
              },
              {
                $and: [
                  { $eq: [{ $type: "$ends.first._id" }, "objectId"] },
                  { $gt: [{ $size: "$nodes" }, 0] },
                  {
                    $cond: [
                      {
                        $in: ["$ends.first._id", "$nodes._id"],
                      },
                      false,
                      true,
                    ],
                  },
                ],
              },
            ],
          },
          true,
          false,
        ],
      },
      startCursor: { $first: "$nodes" },
      endCursor: { $last: "$nodes" },
    },
  });
  const cursorProjection = Object.keys(originalSort as any).reduce(
    (cursorProjection, key) => ({ ...cursorProjection, [key]: 1 }),
    {}
  );
  nodes.project({
    nodes: 1,
    edges: {
      node: 1,
      cursor: cursorProjection,
    },
    pageInfo: {
      count: 1,
      hasNextPage: 1,
      hasPreviousPage: 1,
      startCursor: cursorProjection,
      endCursor: cursorProjection,
    },
  });
  return {
    toAggregate() {
      return nodes;
    },
    then(resolve: () => any, reject: () => any) {
      return nodes.then((x) => x[0]).then(resolve, reject);
    },
  };
}

export function toCursorFromKeys<
  Result extends MongooseRelayDocument<DefaultRelayQuery>
>(
  keys: (keyof NonNullable<
    MongooseRelayPaginateInfoOnModel<Result>["after"]
  >)[],
  doc: Result
) {
  return keys.reduce(
    (obj, key) => ({ ...obj, [key]: doc[key] }),
    {} as Partial<Result>
  );
}

/** Creates a typed relay connection. This is what relay uses for it's cursor-based pagination algorithm.
 * It can be constructed using three things: a set of documents called nodes, a transform that turns a document/node into a cursor,
 * and finally some metadata about paging which is called the `pagingInfo`.
 *
 *
 * @param cursorKeys The way to turn a node into a cursor. Given certain props it will create a partial document node known as the cursor of the original document node with only those keys that are listed. For more info on cursors see {@link PagingCursor}
 * @param pagingInfo the metadata about paging information (such as cursors, number of documents returned, etc.)
 * used by the client to gain some insight into the query and to more easily re-query and fetch the next
 * and previous page.
 * @param nodes The nodes of the relay connection
 * @returns A {@link RelayResult}
 * @public
 */
export function relayResultFromNodes<
  Result extends MongooseRelayDocument<DefaultRelayQuery>
>(
  cursorKeys: (keyof NonNullable<
    MongooseRelayPaginateInfoOnModel<Result>["after"]
  >)[],
  {
    count,
    hasNextPage,
    hasPreviousPage,
  }: Pick<
    RelayResult<Result[]>["pageInfo"],
    "count" | "hasNextPage" | "hasPreviousPage"
  >,
  nodes: Result[]
): RelayResult<Result[]> {
  return {
    edges: nodes.map((node) => ({
      node: node,
      cursor: toCursorFromKeys(cursorKeys, node),
    })),
    nodes,
    pageInfo: {
      count,
      hasNextPage,
      hasPreviousPage,
      endCursor: nodes[nodes.length - 1]
        ? toCursorFromKeys(cursorKeys, nodes[nodes.length - 1])
        : null,
      startCursor: nodes[0] ? toCursorFromKeys(cursorKeys, nodes[0]) : null,
    },
  };
}

/** Alters a relay connection to have a different nodeType for each node in the nodes and edges property.
 * @param doc the relay style connection document to alter
 * @param transform a mapping transform to turn one thing into another
 * @returns An altered relay style connection with a new node type
 */
export function alterNodeOnResult<Result, U>(
  doc: RelayResult<U[]>,
  transform: (doc: U, index?: number, arr?: U[], thisArg?: U[]) => Result
): TransformedRelayResult<U[], Result[]> {
  return {
    pageInfo: doc.pageInfo,
    nodes: doc.nodes.map(transform),
    edges: doc.edges.map((x) => ({
      ...x,
      node: transform(x.node),
    })),
  };
}

declare module "mongoose" {
  interface Query<
    ResultType /* eslint-disable-line */,
    DocType /* eslint-disable-line */,
    THelpers = {} /* eslint-disable-line */,
    RawDocType = DocType /* eslint-disable-line */
  > {
    /** This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
     * allows one to use cursor based pagination.
     *
     * For more on cursors see {@link PagingCursor}
     *
     * For more info on using cursor based pagination algorithms like relay see:
     *
     * {@link https://relay.dev/docs/guides/graphql-server-specification/  the documentation for relay's connection spec} (look at this one for docs in more laymans terms),
     *
     * {@link https://relay.dev/graphql/connections.htm  the actual relay spec} (look at this one for very exact and concise, but possibly confusing language),
     *
     * @param this the query to add pagination to
     * @param paginationInfo the information to help with the paging
     * @returns
     */
    relayPaginate<Q extends DefaultRelayQuery>(
      this: Q,
      paginateInfo?: Partial<MongooseRelayPaginateInfo<Q>>
    ): MongooseQuery<
      RelayResult<MongooseRelayDocument<Q>[]>,
      QueryDocType<Q>,
      QueryHelpers<Q>,
      QueryRawDocType<Q>
    > &
      QueryHelpers<Q>;
  }
  interface Model<
    T /* eslint-disable-line */,
    TQueryHelpers = {} /* eslint-disable-line */,
    TMethodsAndOverrides = {} /* eslint-disable-line */,
    TVirtuals = {} /* eslint-disable-line */
  > {
    /** This is an implementation of the relay pagination algorithm for mongoose. This algorithm and pagination format
     * allows one to use cursor based pagination.
     *
     * For more on cursors see {@link PagingCursor}
     *
     * For more info on using cursor based pagination algorithms like relay see:
     *
     * {@link https://relay.dev/docs/guides/graphql-server-specification/  the documentation for relay's connection spec} (look at this one for docs in more laymans terms),
     *
     * {@link https://relay.dev/graphql/connections.htm  the actual relay spec} (look at this one for very exact and concise, but possibly confusing language),
     *
     * @param this the Model to add pagination through an aggregate to
     * @param paginationInfo the information to help with the paging
     * @returns
     */
    aggregateRelayPaginate<T>(
      this: Model<T>,
      aggregate: PipelineStage[],
      paginateInfo?: Partial<MongooseRelayPaginateInfoOnModel<T>>
    ): {
      toAggregate: <D>() => Aggregate<
        unknown extends D ? [RelayResult<T[]>] : D
      >;
      then: Aggregate<RelayResult<T[]>>["then"];
    };
  }
}

/** Creates the relay paginate plugin, so that you can use relayPaginate
 * @private
 */
function relayPaginatePlugin(schema: Schema) {
  (schema.query as any) /* eslint-disable-line */.relayPaginate = function (
    paging: any /* eslint-disable-line */
  ) {
    return relayPaginate(this, paging);
  };
  (schema.statics as any) /* eslint-disable-line */.aggregateRelayPaginate =
    function (
      aggregate: PipelineStage[],
      paging: any /* eslint-disable-line */
    ) {
      return aggregateRelayPaginate(this, aggregate, paging);
    };
}

/** Registers the relayPaginatePlugin with mongoose, so the user doesn't need to. */
plugin(relayPaginatePlugin);
