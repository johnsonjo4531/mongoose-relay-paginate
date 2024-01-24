<p align="center">
  <img src="./mongoose-relay-paginate/static/img/logo.png" />
</p>

## Compatible MongoDB versions

Your instance of MongoDB should be running version 4.4 or later. Your version of mongoose should be 7.5.1 or later

## Docs

View the [docs](https://johnsonjo4531.github.io/mongoose-relay-paginate/)

## Changelog

The [changelog is available here.](https://johnsonjo4531.github.io/mongoose-relay-paginate/docs/Changelog)

## What

This library is meant to allow cursor based pagination between the client and the server. In many ways this cursor based way is similar to the way you would use skip and limit.

Cursor based pagination is a technique that is used by the likes of Facebook and Twitter on their Feeds.

Personally I recommend cursor based pagination if you are doing something like an infinite scroll feed. If however you are doing something more like a table of data where you want to select a page of results skip and limit will probably be a better option.

> **Technical side note:** Although if you really need the selection of a page of results you could technically combine the approaches by providing a skip while still using the library's cursor based PagingInfo, and then you'd get the best of both. Although I would suggest using the library's PagingInfo where possible and only reach for skip if you absolutely need it.


### Typical paging with Skip and Limit (without this library)

Imagine you're building a web api and you want to allow your users to request a collection of data, but you do not
want to give them all the data back at once. You would generally reach for two very typical things in mongodb skip and limit, though like everything there are pros and cons to this approach which were explained in the previous section. Basically to use skip and limit you would pass them from your client to your server in an API route. Your API route might accept an ISkipLimit like so:

```ts
interface ISkipLimit {
  skip: number;
  limit: number;
}
```

Then calling a function like below in your api get route or graphql query:

```ts
function findUsers(skipLimit: ISkipLimit): Promise<User[]> {
  return UserModel.find({
    //... Some possible conditions or none is fine too.
  }).skip(skipLimit.skip).limit(skipLimit.limit).exec();
}
```

Notice the type returned here is your typical array of users.

Your front end would then have to somehow communicate the ISkipLimit interface to the backend, so it could do the above. You would typically do that with the use of your request's query parameters or the request's body.


### Paging with cursor based pagination instead (with this library)

The pagination process with a cursor is quite a bit more involved to implement from scratch that's where this library comes in, so that the process of using cursor based pagination will be simpler for mongodb users. With this library paginating with cursor based pagination we use the library's provided type `PagingInfo` to communicate to the server the same logic a typical skip and limit would provide, but the type looks like this instead:


```ts
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
 * in your collection then your after cursor otherwise you will get 0 results.
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
```

> You may be wondering what the `before` and `after` is and what exactly the `PagingCursor` type is, but we'll get to that after we show you the return result of the plugin.

So this is now the data used between the client and server to communicate what part of the data we want to return from the query. The `first` signifies to fetch the given `first` number of records from the collection. The `last` signifies to fetch the given `last` number of records. The `after` signifies starting from some record's cursor fetch `after` that record. The `before` signifies starting from some record's cursor fetch `before` that record.


This pagingInfo is passed into the `.relayPaginate()` method that is available on your queries once this library has properly been initialized. So, you would use that in a route like this:

```ts
function findUsers(pagingInfo: PagingInfo<User>): Promise<RelayResult<User[]>> {
  return UserModel.find({
    //... Some possible conditions or none is fine too.
  }).relayPaginate(pagingInfo).exec();
}
```

But wait the notice the type returned here from the plugin is not just your typical User array (`User[]`). Instead it is a `RelayResult<User[]>` which the RelayResult looks like so:

```ts
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
```

So it looks like our `User[]` is just our `relayResult.nodes`, so our frontend can use the user array like that, but also there is some other metadata about the paging process being done which would allow our frontend to control the pagination for us (which is why we would send the whole `RelayResult<User[]>` to the frontend and not just the nodes.). Also if you were being quite observant you may notice that mysterious `PagingCursor` from our `PagingInfo`'s `after` and `before` properties. This is because those cursors can be passed back to our server through the `PagingInfo` as our `before` or `after` cursor. This process of sending the data back into the relayPaginate plugin is outlined in more detail in the [Paging page](paging).



## Why

Because no existing pagination for mongoose that I can find was all of the following:

- Well tested
- Optimized
- Cursor based
- Relay Compatible

### FAQ

**Q** Doesn't MongoDB already have a built-in cursoring mechanism, why reinvent the wheel?

**A** Yes it does already have one, but that is meant to be used between the server and the database where as this library provides the cursoring/paging to be done between the client and the server.

## How

## Installation

To use this library first install in your project, like so:

```bash
npm i mongoose-relay-paginate
```

Then you need to register the plugin sometime before you create your models see [mongoose's global plugins documentation](https://mongoosejs.com/docs/plugins.html#global
) for help:

```ts
import { plugin, Model, model, Schema } from "mongoose";
import { relayPaginatePlugin, RelayPaginateQueryHelper, RelayPaginateStatics  } from "mongoose-relay-paginate";

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
const UserModel = model<User, UserModel>("User", schema);
```

## Usage

Now the relayPaginate should be available on your model's mongoose queries, so you can use it as shown below.


```ts

const result = await UserModel.find()
  // sorting by id from largest (most recent)--> to smallest (most early) using mongoose's default sort.
  .sort({ _id: -1 })
  // This library's `relayPaginate` can now be used off your query
  // after the above setup.
  .relayPaginate({
    first: 1,
  });
```

Or use an aggregate query off of your model:

```ts
const result = await UserModel
  // sorting by id from largest-->smallest using mongoose's default sort.
  .aggregateRelayPaginate(
    [{$sort: {_id: 1}}],
    {
    first: 1,
  });
```

The result will always come back in the form of:

```ts
type result = {
  nodes: UserModel[],
  edges: {
    node: UserModel,
    cursor: {
      // whatever fields were sorted on or just _id
    }
  },
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: {
      // whatever fields were sorted on or just _id
    };
    startCursor: {
      // whatever fields were sorted on or just _id
    };
  }
}
```

For more details view the [docs](https://johnsonjo4531.github.io/mongoose-relay-paginate/).
