---
slug: why-cursor-based-paging
title: Why would I want cursor based paging?
authors: [johnsonjo4531]
tags: [why, pagination, cursors, cursor, cursoring, paging]
---


## TLDR; When should I choose cursoring?

When your new information is being added to the beggining of your sorted list that is returned from a database.

## What are alternatives to cursor based paging?

Cursor based paging is sometimes just called cursoring so as not to confuse the term with regular non-cursor based paging.

From here on in this blog post I will use paging to refer to non-cursor based paging and cursoring to refer to cursor based paging.


If you don't know what cursoring is [read more about cursoring here](../2022-02-30-what-is-cursoring-and-pagination.md).

Paging generally uses skip and limit. Paging is usually displayed in individual pages and allows one to move from page to page with something like this:

![Pagination Buttons](./paging.png)

Whereas Cursoring is usually displayed in an infinite scrolling feed.

The problem with paging is say your pages of items are from newest to oldest, and that you store 20 items on each page. You (the user) are on page 2 and suddenly 20 new items are submitted to the beginning of the list of items. Suddenly now you're on page 3, but the UI still shows you on page 2, so when you click on page 3 nothing would appear to happen.

To avoid this problem we use cursoring. Which instead of keeping track of where you are based off a skip and limit, it keeps track of where you are based off of any single item in the collection and then allows you to ask for things before or after that item. Each single item in a collection can be turned into a cursor, so that you can query other items relative to where that item is in the collection.
