import {
  QueryWithHelpers,
  Schema,
  Model,
  Aggregate,
  QueryOptions,
  PipelineStage,
  FilterQuery,
  ProjectionType,
  HydratedDocument,
} from "mongoose";
const DEFAULT_LIMIT = 100;

type FindArgs<DocType = unknown> =
  | [Record<string, FilterQuery<DocType>>]
  | [Record<string, FilterQuery<DocType>>, ProjectionType<DocType>]
  | [
      Record<string, FilterQuery<DocType>>,
      ProjectionType<DocType>,
      QueryOptions<DocType>
    ];

type SortArgs = [Record<string, -1 | 1>];

type LimitArgs = [number];

/** A default query used throughout this file to help our mongoose queries have an expected structure
 * that the relay specification relies on.
 */
type DefaultRelayQuery<T = unknown, QueryHelpers = unknown> = QueryWithHelpers<
  T[],
  T,
  QueryHelpers
>;

/** A mock query structure for our defaultRelayQuery that can play back commands as either an aggregate or
 * a query.
 */
class AggregateOrQueryCommandReplayer<T> {
  commands: (
    | { type: "sort"; args: SortArgs }
    | { type: "limit"; args: LimitArgs }
    | { type: "find"; args: FindArgs<T> }
    | {
        type: "aggregate";
        args: [pipeline: PipelineStage.FacetPipelineStage[]];
      }
  )[] = [];

  sort(...args: SortArgs) {
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

  limit(...args: LimitArgs) {
    this.commands.push({
      type: "limit",
      args,
    });
  }

  find(...args: FindArgs<T>) {
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
 * @public
 */
export type PagingCursor<DocType = unknown> = {
  [P in keyof DocType]?: DocType[P] | undefined | null;
};

/** Info about how to page forward and backward
 *
 *
 * `first` and `last` are alot like limit in a typical skip and limit scheme.
 * This is because first and last signify how many elements to return.
 * You should never supply both `first` and `last` at the same time.
 * You should either supply one or the other, but not both.
 * Supplying both will lead to unpredicted behaviour.
 *
 * `after` and `before` are more like the typical skip in skip and limit.
 * This is because after and before signify where the
 * collection starts and stops searching.
 * You may supply both the after and before, but your before cursor must be later
 * in your collection than your after cursor otherwise you will get 0 results.
 *
 * @public
 */
export type PagingInfo<DocType = unknown> = {
  /** fetch the `first` given number of records */
  first?: number;
  /** fetch the `last` given number of records */
  last?: number;
  /** fetch `after` the given record's cursor */
  after?: PagingCursor<DocType> | null | undefined;
  /** fetch `before` the given record's cursor */
  before?: PagingCursor<DocType> | null | undefined;
};

/** This algorithm is modified from the graphql-relay-specification.
 *
 * for more info see either:
 *
 * {@link https://relay.dev/docs/guides/graphql-server-specification/#connections  the documentation for relay relevant to connections} (documentation is generally a bit friendlier in wording), or
 * {@link https://relay.dev/graphql/connections.htm#ApplyCursorsToEdges()  the relay connection specification} (specs are generally in more specific and esoteric terms)
 */
const edgesToReturn = function EdgesToReturn<T>(
  query: DefaultInnerRelayQuery<T>,
  { before, after, first, last }: PagingInfo<T>,
  { originalSort }: { originalSort: QueryOptions["sort"] },
  includeBeforeAfterEdge = false
): DefaultInnerRelayQuery<T> {
  const edges = applyCursorsToEdges(
    query,
    originalSort,
    before,
    after,
    includeBeforeAfterEdge
  );
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
    edges.sort(
      Object.fromEntries(
        Object.entries(originalSort)
          .map(([key, value]) => [
            key,
            typeof value === "number" ? (value >= 0 ? -1 : 1) : null,
          ])
          .filter((x): x is [string, 1 | -1] => Boolean(x[1]))
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
const applyCursorsToEdges = <T>(
  allEdges: DefaultInnerRelayQuery<T>,
  originalSort: QueryOptions["sort"],
  before?: PagingCursor<T> | null | undefined,
  after?: PagingCursor<T> | null | undefined,
  includeBeforeAfterEdge = false
) => {
  // Initialize edges to be allEdges.
  const edges = allEdges;
  const sortBy = originalSort;
  const gt: "$gte" | "$gt" = includeBeforeAfterEdge
    ? ("$gte" as const)
    : ("$gt" as const);
  const lt: "$lte" | "$lt" = includeBeforeAfterEdge
    ? ("$lte" as const)
    : ("$lt" as const);
  // If after is set:
  if (after) {
    // Let afterEdge be the edge in edges whose cursor is equal to the after argument.
    // Remove all elements of edges before and including afterEdge.
    Object.entries(after).forEach(([key, value]) => {
      edges.find({
        [key]:
          !sortBy || (sortBy?.[key] as number) === 1
            ? { [gt]: value }
            : { [lt]: value },
        // If the elements are 0, 1, 2, 3, 4, 5 then
        // if sort is ascending: 0 (after: 0) --->, 1, 2, 3, 4, 5
        // if sort is descending: 5 (after: 5) --->, 4, 3, 2, 1, 0
      } as FindArgs<T>[0]);
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
            ? { [lt]: value }
            : { [gt]: value },
      } as FindArgs<T>[0]);
      // If the elements are 0, 1, 2, 3, 4, 5 then
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

export interface RelayResult<Nodes extends unknown[]> {
  edges: {
    node: ElementOfArray<Nodes>;
    cursor: PagingCursor<ElementOfArray<Nodes>>;
  }[];
  nodes: Nodes;
  pageInfo: {
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
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor?: PagingCursor<ElementOfArray<OriginalNodes>> | null;
    startCursor?: PagingCursor<ElementOfArray<OriginalNodes>> | null;
  };
}

/** A helper generic type which when given a DefaultRelayQuery will infer its RawDocType */
type QueryRawDocType<Q extends DefaultRelayQuery> = Q extends QueryWithHelpers<
  unknown,
  unknown,
  unknown,
  infer RawDocType
>
  ? RawDocType
  : never;

/** A helper generic type which when given a DefaultRelayQuery will infer the DocType */
type QueryDocType<Q extends DefaultRelayQuery> = Q extends QueryWithHelpers<
  unknown,
  infer DocType,
  unknown,
  unknown
>
  ? DocType
  : never;

/** A helper generic type which when given a DefaultRelayQuery will infer its QueryHelpers */
type QueryHelpers<Q extends DefaultRelayQuery> = Q extends QueryWithHelpers<
  unknown,
  unknown,
  infer QueryHelpers,
  unknown
>
  ? QueryHelpers
  : never;

/** A helper generic type which when given a DefaultRelayQuery will infer the QueryResult */
type QueryResult<Q extends DefaultRelayQuery> = Q extends QueryWithHelpers<
  infer QueryResult,
  unknown,
  unknown,
  unknown
>
  ? QueryResult
  : never;

type ModelRawDocType<
  M extends Model<unknown, unknown, unknown, unknown, unknown, unknown>
> = M extends Model<
  infer RawDocType,
  unknown,
  unknown,
  unknown,
  unknown,
  unknown
>
  ? RawDocType
  : never;

/** A helper generic type which when given a {@link DefaultRelayQuery} will construct its corresponding document node that will be part of the return type of {@link relayPaginate}. */
type MongooseRelayDocument<Q extends DefaultRelayQuery> = HydratedDocument<
  QueryResult<Q>,
  QueryDocType<Q>,
  QueryHelpers<Q>
>;

/** A helper generic type which when given a {@link DefaultRelayQuery} and {@link PagingCursor} constructs the document type needed. */
type MongooseRelayPaginateInfo<Q extends DefaultRelayQuery> =
  MongooseRelayPaginateInfoOnModel<
    Q extends QueryWithHelpers<unknown, unknown, unknown, infer DocType>
      ? DocType
      : never
  >;

/** A helper generic type which when given a {@link Model} and {@link PagingCursor} construct its corresponding document type. */
type MongooseRelayPaginateInfoOnModel<D> = PagingInfo<D>; // | UnwrapArray<D> extends Document<unknown, unknown, infer G> ? G : never

function paginator<T>(
  { ...pagingInfo }: MongooseRelayPaginateInfo<DefaultRelayQuery<T>> = {},
  sort: Record<string, unknown>,
  includeBeforeAfterEdge = false
) {
  const pseudoQuery = new AggregateOrQueryCommandReplayer<T>();
  edgesToReturn(
    pseudoQuery,
    pagingInfo,
    {
      originalSort: sort,
    },
    includeBeforeAfterEdge
  );
  return pseudoQuery;
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
 * @param query the query to add pagination to
 * @param paginationInfo the information to help with the paging
 * @returns
 */
export function relayPaginate<T>(
  query: DefaultRelayQuery<T>,
  { ...pagingInfo }: MongooseRelayPaginateInfo<DefaultRelayQuery<T>> = {}
): QueryWithHelpers<
  Promise<RelayResult<MongooseRelayDocument<DefaultRelayQuery<T>>[]>>,
  QueryDocType<DefaultRelayQuery<T>>,
  QueryHelpers<DefaultRelayQuery<T>>,
  QueryRawDocType<DefaultRelayQuery<T>>
> {
  const sort = query.getOptions().sort ?? {
    _id: 1,
  };

  return paginator<T>(
    {
      ...pagingInfo,
      // first:
      //   typeof pagingInfo.first === "number" ? pagingInfo.first + 1 : undefined,
      // last:
      //   typeof pagingInfo.last === "number" ? pagingInfo.last + 1 : undefined,
    },
    sort
  )
    .toQuery(query.clone())
    .transform(async (_nodes) => {
      const { sortKeys, hasNextPage, hasPreviousPage } = await getPageInfo<T>(
        sort,
        pagingInfo,
        query
      );

      const nodes = _nodes as unknown as MongooseRelayDocument<
        DefaultRelayQuery<T>
      >[];
      return relayResultFromNodes(
        sortKeys,
        {
          hasNextPage,
          hasPreviousPage,
        },
        nodes
      );
    }) as QueryWithHelpers<
    Promise<RelayResult<MongooseRelayDocument<DefaultRelayQuery<T>>[]>>,
    QueryDocType<DefaultRelayQuery<T>>,
    QueryHelpers<DefaultRelayQuery<T>>,
    QueryRawDocType<DefaultRelayQuery<T>>
  > &
    QueryHelpers<DefaultRelayQuery<T>>;
}

async function getPageInfo<T>(
  sort: Record<string, unknown>,
  pagingInfo: {
    /** fetch the `first` given number of records */
    first?: number | undefined;
    /** fetch the `last` given number of records */
    last?: number | undefined;
    /** fetch `after` the given record's cursor */
    after?: PagingCursor<T> | null | undefined;
    /** fetch `before` the given record's cursor */
    before?: PagingCursor<T> | null | undefined;
  },
  query: DefaultRelayQuery<T>
) {
  const sortKeys = Object.keys(sort) as (keyof unknown)[];

  const pseudoQuery = new AggregateOrQueryCommandReplayer();
  const edges = applyCursorsToEdges(
    pseudoQuery,
    sort,
    pagingInfo.before,
    pagingInfo.after
  ).toQuery(query.clone());
  // const count = await query.model
  //   .find(query.getFilter())
  //   .estimatedDocumentCount();

  const edgesLength = await edges
    .limit(Math.max(pagingInfo?.first ?? 0, pagingInfo?.last ?? 0) + 1)
    .countDocuments();
  ///
  const hasNextPage = await (async function () {
    let returnValue = false;
    if (typeof pagingInfo.first === "number") {
      returnValue = edgesLength > pagingInfo.first;
    }
    if (!returnValue && pagingInfo.before) {
      returnValue =
        (
          await paginator<T>(
            {
              first: 1,
              after: pagingInfo.before,
            },
            sort,
            true
          ).toQuery(query.clone())
        ).length > 0;
    }
    return returnValue;
  })();

  const hasPreviousPage = await (async function () {
    let returnValue = false;
    if (typeof pagingInfo.last === "number") {
      returnValue = edgesLength > pagingInfo.last;
    }
    if (!returnValue && pagingInfo.after) {
      returnValue =
        (
          await paginator(
            {
              first: 1,
              before: pagingInfo.after,
            },
            sort,
            true
          ).toQuery(query.clone())
        ).length > 0;
    }
    return returnValue;
  })();
  return { sortKeys, hasNextPage, hasPreviousPage };
}

async function getAggregatePageInfo<T>(
  sort: Record<string, unknown>,
  pagingInfo: {
    /** fetch the `first` given number of records */
    first?: number | undefined;
    /** fetch the `last` given number of records */
    last?: number | undefined;
    /** fetch `after` the given record's cursor */
    after?: PagingCursor<T> | null | undefined;
    /** fetch `before` the given record's cursor */
    before?: PagingCursor<T> | null | undefined;
  },
  model: Model<T>,
  userAggregates: PipelineStage[]
) {
  const sortKeys = Object.keys(sort) as (keyof unknown)[];

  const pseudoQuery = new AggregateOrQueryCommandReplayer<T>();
  const edges = applyCursorsToEdges<T>(
    pseudoQuery,
    sort,
    pagingInfo.before,
    pagingInfo.after
  ).toAggregate(model, userAggregates);

  const edgesLength = (
    (await edges
      .limit(Math.max(pagingInfo.first ?? 0, pagingInfo.last ?? 0) + 1)
      .count("count")) as unknown as [{ count: number }]
  )?.[0]?.count;
  ///
  const hasNextPage = await (async function () {
    let returnValue = false;
    if (typeof pagingInfo.first === "number") {
      returnValue = edgesLength > pagingInfo.first;
    }
    if (!returnValue && pagingInfo.before) {
      returnValue =
        (
          await paginator<T>(
            {
              first: 1,
              after: pagingInfo.before,
            },
            sort,
            true
          ).toAggregate(model, userAggregates)
        ).length > 0;
    }
    return returnValue;
  })();

  const hasPreviousPage = await (async function () {
    let returnValue = false;
    if (typeof pagingInfo.last === "number") {
      returnValue = edgesLength > pagingInfo.last;
    }
    if (!returnValue && pagingInfo.after) {
      returnValue =
        (
          await paginator<T>(
            {
              first: 1,
              before: pagingInfo.after,
            },
            sort,
            true
          ).toAggregate(model, userAggregates)
        ).length > 0;
    }
    return returnValue;
  })();
  return { sortKeys, hasNextPage, hasPreviousPage };
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
  toNodesAggregate: <AggregateResult = [T[]]>() => Aggregate<AggregateResult>;
  then: Aggregate<RelayResult<T[]>>["then"];
} {
  const pseudoQuery = new AggregateOrQueryCommandReplayer<T>();
  const originalSort: PipelineStage.Sort["$sort"] = [...aggregate]
    .reverse()
    .find((x): x is PipelineStage.Sort => "$sort" in x)?.["$sort"] ?? {
    _id: 1,
  };
  edgesToReturn(pseudoQuery, pagingInfo, {
    originalSort,
  });
  const nodes: Aggregate<T[]> = pseudoQuery.toAggregate(
    model,
    aggregate
  ) as unknown as Aggregate<T[]>;

  return {
    toNodesAggregate<AggregateResult = T[]>() {
      return nodes as unknown as Aggregate<AggregateResult>;
    },
    then(resolve, reject) {
      return getAggregatePageInfo(originalSort, pagingInfo, model, aggregate)
        .then(async ({ sortKeys, ...pageInfo }) => {
          const _nodes = await nodes;
          return relayResultFromNodes(sortKeys, pageInfo, _nodes);
        })
        .then(resolve, reject);
    },
  };
}

export function toCursorFromKeys<Node>(
  keys: (keyof NonNullable<MongooseRelayPaginateInfoOnModel<Node>["after"]>)[],
  doc: Node
) {
  return keys.reduce(
    (obj, key) => ({ ...obj, [key]: doc[key] }),
    {} as Partial<Node>
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
export function relayResultFromNodes<Node>(
  cursorKeys: (keyof NonNullable<
    MongooseRelayPaginateInfoOnModel<Node>["after"]
  >)[],
  {
    hasNextPage,
    hasPreviousPage,
  }: Pick<RelayResult<Node[]>["pageInfo"], "hasNextPage" | "hasPreviousPage">,
  nodes: Node[]
): RelayResult<Node[]> {
  return {
    edges: nodes.map((node) => ({
      node: node,
      cursor: toCursorFromKeys(cursorKeys, node),
    })),
    nodes,
    pageInfo: {
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

/**
 *
 * @example
 *
 * // 1. Create an interface representing a document in MongoDB.
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
 *
 * @public
 */
export interface RelayPaginateQueryHelper {
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
  ): QueryWithHelpers<
    RelayResult<MongooseRelayDocument<Q>[]>,
    QueryDocType<Q>,
    QueryHelpers<Q>,
    QueryRawDocType<Q>
  > &
    QueryHelpers<Q>;
}
/**
 * @example
 * // 1. Create an interface representing a document in MongoDB.
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
 * @public
 */
export interface RelayPaginateStatics {
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
  aggregateRelayPaginate<M extends Model<any> /* eslint-disable-line */>(
    this: M,
    aggregate: PipelineStage[],
    paginateInfo?: Partial<MongooseRelayPaginateInfoOnModel<ModelRawDocType<M>>>
  ): {
    toNodesAggregate: <
      AggregateResult = [ModelRawDocType<M>[]]
    >() => Aggregate<AggregateResult>;
    then: Aggregate<RelayResult<ModelRawDocType<M>[]>>["then"];
  };
}
// }

/** Options for the relayPaginatePlugin
 * @public
 */
export interface PluginOptions {
  /** the maximum allowed limit for any query,
   * so that the client can't request over this
   * amount of items paged at a time.
   *
   * @default 100
   **/
  maxLimit?: number;
}

/** Creates the relay paginate plugin, so that you can use relayPaginate
 */
export function relayPaginatePlugin({ maxLimit = 100 }: PluginOptions = {}) {
  return function _relayPaginatePlugin(schema: Schema) {
    (schema.query as any) /* eslint-disable-line */.relayPaginate = function (
      paging: MongooseRelayPaginateInfo<any> /* eslint-disable-line */
    ) {
      return relayPaginate(this, {
        ...paging,
        first: paging?.first ? Math.min(paging.first, maxLimit) : undefined,
        last: paging?.last ? Math.min(paging.last, maxLimit) : undefined,
      });
    };
    (schema.statics as any) /* eslint-disable-line */.aggregateRelayPaginate =
      function (
        aggregate: PipelineStage[],
        paging: MongooseRelayPaginateInfo<any> /* eslint-disable-line */
      ) {
        return aggregateRelayPaginate(this, aggregate, {
          ...paging,
          first: paging?.first ? Math.min(paging.first, maxLimit) : undefined,
          last: paging?.last ? Math.min(paging.last, maxLimit) : undefined,
        });
      };
  };
}
