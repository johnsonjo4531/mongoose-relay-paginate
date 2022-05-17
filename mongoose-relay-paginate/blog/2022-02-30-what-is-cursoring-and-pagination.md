---
slug: what-is-cursoring
title: What is cursoring and pagination?
authors: [johnsonjo4531]
tags: [what, pagination, cursors, cursor, cursoring, paging]
---

A cursor helps a server to find an item in a database.

If you're not exactly sure what that means here's an analogy.
It's a lot like when you go to the library and have some information for
a specific book. This information you have about the book can help you locate it.

A cursor (some information) can be turned into a database object (the book) by finding the first instance of it in the database (the library).

Below is a hypothetical example:
```
Cursor        -> Some query from a cursor -> DB Object
{name: "bob"} -> Some query from a cursor -> {name: "bob", job: "something", location: "some place 123rd street"}
```

An example of some query from a cursor, in MongoDB is:

```js
const {name, job, location} = await Employee.findOne({name: "bob"});
```

A database object can be turned into a cursor with a transform of some sort in our case it will be provided by the user.

Below is a hypothetical example:
```
DB Object -> some transform to a cursor -> Cursor
{
   name: "bob",
   job: "something",
   location: "some place 123rd street"
}        -> some tranform to a cursor  -> {name: "bob"}
```

an example of how one would make this transform in particular the way this library does is through the cursorKeys option:

```js
UserMode.find().relayPaginate({
  cursorKeys: ["name"]
})
```
