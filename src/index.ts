import {
  Query as MongooseQuery,
  Document,
  plugin,
  Schema,
  Model,
  Aggregate,
  QueryOptions,
  PipelineStage,
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
  )[] = [];

  sort(...args: Parameters<DefaultRelayQuery<T>["sort"]>) {
    this.commands.push({
      type: "sort",
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

  toAggregate(
    model: Model<T>,
    regularAggregate: PipelineStage[],
    additionalAggregates: PipelineStage[] = []
  ): Aggregate<T[]> {
    return model.aggregate<T>([
      ...regularAggregate,
      ...this.commands.map(
        (x): PipelineStage =>
          x.type === "find"
            ? {
                $match: x.args[0],
              }
            : x.type === "limit"
            ? { $limit: x.args[0] }
            : {
                $sort: x.args[0],
              }
      ),
      ...additionalAggregates,
    ]);
  }

  toQuery(query: DefaultRelayQuery<T>): DefaultRelayQuery<T> {
    return this.commands.reduce((query, { type, args }) => {
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
 * an example of how one would make this transform in particular the way this library does is through the toCursor function:
 *
 * ```js
 *
 * ```
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
  ? UnwrapArray<QueryResult>[]
  : never;

/** A helper generic type which when given a {@link DefaultRelayQuery} will construct its corresponding document node that will be part of the return type of {@link relayPaginate}. */
type MongooseRelayDocument<Q extends DefaultRelayQuery> = Document<
  QueryResult<Q>,
  QueryHelpers<Q>,
  QueryDocType<Q>
> &
  QueryRawDocType<Q>;

/** A helper generic type which when given a {@link DefaultRelayQuery} constructs its corresponding toCursor type. */
type MongooseRelayConnectionToCursor<Q extends DefaultRelayQuery> = (
  document: MongooseRelayDocument<Q>
) => Partial<MongooseRelayDocument<Q>>;

/** A helper generic type which when given a {@link DefaultRelayQuery} and {@link PagingCursor} construct its corresponding toCursor type. */
type MongooseRelayPaginateInfo<Q extends DefaultRelayQuery> =
  MongooseRelayPaginateInfoOnModel<MongooseRelayDocument<Q>>;

/** A helper generic type which when given a {@link Model} and {@link PagingCursor} construct its corresponding toCursor type. */
type MongooseRelayPaginateInfoOnModel<D> = {
  toCursor: (document: D) => Partial<D>;
} & PagingInfo;

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
  { toCursor, ...pagingInfo }: MongooseRelayPaginateInfo<Q>
): MongooseQuery<
  Promise<RelayResult<MongooseRelayDocument<Q>[]>>,
  QueryDocType<Q>,
  QueryHelpers<Q>,
  QueryRawDocType<Q>
> &
  QueryHelpers<Q> {
  const pseudoQuery = new AggregateOrQueryCommandReplayer();
  edgesToReturn(pseudoQuery, pagingInfo, {
    originalSort: query.getOptions().sort ?? {
      _id: 1,
    },
  });
  const finalQuery = pseudoQuery.toQuery(query);
  return finalQuery.transform<Promise<RelayResult<MongooseRelayDocument<Q>[]>>>(
    async (nodes) => {
      const countQuery = finalQuery.clone().estimatedDocumentCount();
      const count = await countQuery;

      const anyLimit = pagingInfo.last ?? pagingInfo.first ?? DEFAULT_LIMIT;
      return relayResultFromNodes(
        toCursor,
        {
          count,
          hasNextPage:
            (Boolean(pagingInfo.before) && count > anyLimit) ||
            (Boolean(pagingInfo.after) && count > anyLimit) ||
            count >= anyLimit,
          hasPreviousPage:
            (Boolean(pagingInfo.before) && count > anyLimit) ||
            (Boolean(pagingInfo.after) && count > anyLimit) ||
            count >= anyLimit,
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
export async function aggregateRelayPaginate<T>(
  model: Model<T>,
  aggregate: PipelineStage[],
  { toCursor, ...pagingInfo }: MongooseRelayPaginateInfoOnModel<T>
): Promise<RelayResult<T[]>> {
  const pseudoQuery = new AggregateOrQueryCommandReplayer<T>();
  const originalSort: QueryOptions["sort"] = (
    aggregate.reverse().find((x) => !!(x as { $sort?: unknown })["$sort"]) as {
      $sort?: unknown;
    }
  )?.["$sort"] ?? {
    _id: 1,
  };
  edgesToReturn(pseudoQuery, pagingInfo, {
    originalSort,
  });
  pseudoQuery.sort(
    Object.fromEntries(
      Object.entries(originalSort).map(([key, value]) => [
        key,
        typeof value === "number" ? value : null,
      ])
    )
  );
  const nodes = await pseudoQuery.toAggregate(model, aggregate);
  const { count } = (await pseudoQuery.toAggregate(model, aggregate, [
    { $count: "count" },
  ])) as unknown as { count: number };

  const anyLimit = pagingInfo.last ?? pagingInfo.first ?? DEFAULT_LIMIT;
  return relayResultFromNodes(
    toCursor as unknown as MongooseRelayConnectionToCursor<
      DefaultRelayQuery<unknown>
    >,
    {
      count,
      hasNextPage:
        (!!pagingInfo.before && count > anyLimit) ||
        (!!pagingInfo.after && count > anyLimit) ||
        count >= anyLimit,
      hasPreviousPage:
        (!!pagingInfo.before && count > anyLimit) ||
        (!!pagingInfo.after && count > anyLimit) ||
        count >= anyLimit,
    },
    nodes as unknown as MongooseRelayDocument<DefaultRelayQuery<unknown>>[]
  ) as unknown as RelayResult<T[]>;
}

/** Creates a typed relay connection. This is what relay uses for it's cursor-based pagination algorithm.
 * It can be constructed using three things: a set of documents called nodes, a transform that turns a document/node into a cursor,
 * and finally some metadata about paging which is called the `pagingInfo`.
 *
 *
 * @param toCursor The way to turn a node into a cursor. For more info on cursors see {@link PagingCursor}
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
  toCursor: MongooseRelayPaginateInfoOnModel<Result>["toCursor"],
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
      cursor: toCursor(node),
    })),
    nodes,
    pageInfo: {
      count,
      hasNextPage,
      hasPreviousPage,
      endCursor: nodes[nodes.length - 1]
        ? toCursor(nodes[nodes.length - 1])
        : null,
      startCursor: nodes[0] ? toCursor(nodes[0]) : null,
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
      { toCursor, ...pagingInfo }: MongooseRelayPaginateInfo<Q>
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
      { toCursor, ...pagingInfo }: MongooseRelayPaginateInfoOnModel<T>
    ): Promise<RelayResult<T[]>>;
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
