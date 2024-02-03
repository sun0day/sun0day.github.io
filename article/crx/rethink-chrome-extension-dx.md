---
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Rethink Chrome Extension DX
  - - meta
    - property: og:image
      content: https://user-images.githubusercontent.com/102238922/233404924-2ad437dc-ff93-40fe-b9c6-53f9197f25b9.png
  - - meta
    - property: twitter:image:src
      content: https://user-images.githubusercontent.com/102238922/233404924-2ad437dc-ff93-40fe-b9c6-53f9197f25b9.png
  - - meta
    - property: og:url
      content: https://sun0day.github.io/blog/crx/rethink-chrome-extension-dx.html
  - - meta
    - property: og:description
      content: Just like @sapphi-red said, Vite 4.3 has made amazing performance improvements over Vite 4.2
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Rethink Chrome Extension DX

Recently I have been developing an internal Chrome extension via Vite5. In the beginning, I pursued completing this extension MVP as soon as possible, so I didn't put much focus on the extension engineering. When this extension's features became more and more complex, I found there was still much room to improve the extension DX. Unfortunately, I see few articles and projects concerning the extension DX issues. This article will discuss some critical issues of Chrome extension DX. I also started a new [GitHub repository](https://github.com/sun0day/happy-chrome-extension) to solve these issues, but it still needs a lot of work.

## Pain of HMR

Currently, you can either manually reload your latest extension as the [official document says](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#reload) or reload it internally in scripts via the [`chrome.runtime.reload`](https://developer.chrome.com/docs/extensions/reference/api/runtime#method-reload) native API. Frequently manually reloading, especially reloading an extension is painful during development. As to `chrome.runtime.reload` , it won't be executed until the extension scripts call it, hence, we need to tell the extension scripts to reload totally or replace the manipulated modules once there is a change on related files.

### Assets loading

Unlike loading a normal web page through the network, Chrome loads the extension assets from the local disk. This will block Chrome from querying assets within modern bundler dev servers since handling asset transformation in memory is more efficient.

One solution is to emit those assets into the extension directory from the servers' memory during runtime. Some other bundlers support to do that, but they can hardly support HMR.

### WebSocket limitation

Modern bundlers usually create a WebSocket channel between the browser and the dev server to handle the HMR communication. However, WebSocket is not allowed to be used in some Chrome extension scripts like [content scripts](https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts). 

On the other hand, WebSocket works in the [background service worker](https://developer.chrome.com/docs/extensions/reference/manifest/background). So we could make the bundler create the channel between the service worker and the dev server. Once there's a modification on the module, the server first notifies the service worker, and then the service worker tells content scripts to replace the old module via the [messaging APIs](https://developer.chrome.com/docs/extensions/develop/concepts/messaging). 

### Flow overview

After doing some magic, the Chrome extension HMR process would look like:

![HMR overview](./crx-hmr.jpg)

1. Dev server **loads and watches** the source code.
2. Dev server **emits** the related assets to the extension directory.
3. Chrome **reads** the whole extension directory and **builds** a WebSocket channel between dev server and service worker.
4. Dev server **emits** new module to the extension directory when it watches changes, and then **notifies** service worker.
5. Service worker **sends** messages about the new module to content script.
6. Content script **updates** the new module without reloading.


## Advanced runtime API

Chrome provides rich [native APIs](https://developer.chrome.com/docs/extensions/reference/api) for developers. Those native APIs are flexible and primitive, you can compose them for more advanced features. The issue here is that we need more straightforward APIs to simplify our codes. For example, we can run the following codes in the service worker to retrieve cookies of the matched URL.

```js
/* service worker */
const cookies = await chrome.cookies.getAll({ url })
```

If we want to retrieve cookies from the current page context, we need to get cookie stores first, otherwise, we may retrieve cookies from another Chrome window instance.

```js
/* service worker */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // get all cookie stores
    const stores = await chrome.cookies.getAllCookieStores();
    // get current page's cookie store
    const storeId = stores.find((store) => store.tabIds.includes(sender.tab.id)).id;
    const cookies = await chrome.cookies.getAll({ url: request.url, storeId })
    // send cookies back to content script
    sendResponse(cookies)
})
```

We can encapsulate the cookie retrieve logic into a single function `getCookies`, and then the code would be simpler.

```js
/* service worker */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // retrieve cookies by on function
    const cookies = getCookies(request.url, sender.tab.id)
    // send cookies back to content script
    sendResponse(cookies)
})
```

Encapsulating reusable logic is not only good for making the extension's codes clean and robust but also for cutting native API understanding costs. We can design better APIs for more complex scenarios based on the native ones


## Storage issues

### Data synchronization

### Data validation

Integration with UI frameworks

## Stricter lint

## Extension Starter

## Conclusion

This article talked about some issues and solutions of Chrome extension DX, due to space limitations, there are still quite a lot of issues(such as "message criteria" and "inspect mode") not mentioned here. I hope I can find the best practices for them in the future, if you have any ideas about improving Chrome extension DX, you can leave an issue or start a discussion at the repository mentioned above.
