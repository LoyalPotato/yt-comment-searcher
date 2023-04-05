# Youtube Comment Searcher

This is a small extension that you can use to search comments on a particular video.

For now you'd need to provide your own API key ( which you can find how to get in the [youtube api overview](https://developers.google.com/youtube/v3/getting-started) ).
Once you have a key go to [popup.js](src/scripts/popup.js) and you'll see a line like this:

```js
    baseUrl.searchParams.append(
      "key",
      // Key here
    );
```

Replace the comment with your key and you should be set :)

### TODO

- Show a different screen when it's not on an youtube video; 
