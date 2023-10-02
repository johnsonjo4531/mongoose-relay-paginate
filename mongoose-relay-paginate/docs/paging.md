---
sidebar_position: 4
---


# Paging with Cursors

## Note on relayPaginate vs. aggregateRelayPaginate.

With relayPaginate and aggregateRelayPaginate they both take the same options for paging, but the only difference is that relayPaginate takes these options in the first argument spot and aggregateRelayPaginate takes them in the second argument spot.

## Data Setup

First we'll setup some test documents. This is only for illustrative purposes, so you know what documents are in the mongoDB collection for the UserModel.

```ts
const doc = new UserModel({
  name: "Bill",
  email: "bill@example.com",
  avatar: "https://i.imgur.com/dM7Thhn.png",
});

const doc2 = new UserModel({
  name: "Jill",
  email: "jill@example.com",
  avatar: "https://i.imgur.com/dM7Thhn.png",
});

const doc3 = new UserModel({
  name: "Phill",
  email: "Phill@example.com",
  avatar: "https://i.imgur.com/dM7Thhn.png",
});
await doc.save();
await doc2.save();
await doc3.save();
```

## Forward Pagination through using `first` and `after`

Once we have our data setup (as given in the above Data Setup section), we can do our first pagination which is a forward pagination.

We prep by doing our first query which since we are moving forward in the collection we use the `first` option to grab the `first 1` documents.

```ts
const result = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      // we get the first item only (which will be Bill's document)
      first: 1
    });
console.log(result.nodes); // Will be an array of only Bill's document.
console.log(result.pageInfo.hasNextPage); // Will return true since there are still more documents that could be queried.
```

Then we pass it's resultant `endCursor` to the after argument to get the next page.

```ts
const result2 = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      after: result.pageInfo.endCursor,
      // we get the first item after Bill's record only (which will be Jill's document)
      first: 1
    });
console.log(result2.nodes); // Will be an array of only Jill's document.
console.log(result2.pageInfo.hasNextPage); // Will return true since there are still more documents that could be queried.
```

We could repeat this process indefinitely until the pageInfo indicates that `hasNextPage` is `false`.

```ts
const result3 = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      after: result2.pageInfo.endCursor,
      // we get the first item after Jill's record only (which will be Phill's document)
      first: 1
    });
console.log(result3.nodes); // Will be an array of only Phill's document.
console.log(result3.pageInfo.hasNextPage); // Will return false, since there are no more documents to be queried.
```

Note that the `result.pageInfo.count` will return the same value for `result1`, `result2`, and `result3` since it is a total count of all nodes that can be returned by a particular query before applying any and all .


## Backward Pagination through Using `last` and `before`

To cursor backwards we follow a slightly different pattern. Once we have our data setup (as given in the above Data Setup section), we can do our second pagination which is a backward pagination.

We prep by doing our query, which since we are moving backwards we need to use the `last` option instead of the first option.

```ts
const result = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      // we get the last item only (which will be Phill's document)
      last: 1
    });
console.log(result.nodes); // Will be an array of only Phill's document.
console.log(result.pageInfo.hasPreviousPage); // Will return true since there are still more documents that could be queried.
```

Then we pass it's resultant `startCursor` to the before argument to get the previous page.

```ts
const result2 = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      before: result.pageInfo.startCursor,
      // we get the last item before Bill's record only (which will be Jill's document)
      last: 1
    });
console.log(result2.nodes); // Will be an array of only Jill's document.
console.log(result2.pageInfo.hasPreviousPage); // Will return true since there are still more documents that could be queried.
```

We could repeat this process indefinitely until the pageInfo indicates that `hasPreviousPage` is `false`.

```ts
const result3 = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      before: result2.pageInfo.endCursor,
      // we get the last item before Jill's record only (which will be Bill's document)
      last: 1
    });
console.log(result3.nodes); // Will be an array of only Bill's document.
console.log(result3.pageInfo.hasPreviousPage); // Will return false, since there are no more documents to be queried.
```


## Last doesn't change sort-order

Last doesn't change the sort order of the documents returned from the query. They are in the order the query defined them. Which means your results for first and last could be the same if you somehow query the whole collection. For example, if you had the documents like we do of with names of  `Bill`, `Jill`, and `Phill` like we do above and sort by name ascending (A to Z). You would get the following (possibly unexpected) results from using first and then using last.

Using First:

```ts
const result = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      first: 100
    });
console.log(result.nodes.map(x => x.name)); // ["Bill", "Jill", "Phill"]
```

Using Last you get the same result.

```ts
const result = await UserModel.find()
    // We sort by names from a-z
    .sort({ name: 1 })
    .relayPaginate({
      last: 100
    });
console.log(result.nodes.map(x => x.name)); // ["Bill", "Jill", "Phill"]
```
