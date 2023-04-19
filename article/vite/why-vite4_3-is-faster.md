# Why Vite4.3 is faaaaster?

Just like [@sapphi-red](https://github.com/sapphi-red/) said, Vite4.3 has made an amazing performance improvement than Vite4.2.


![perf](https://user-images.githubusercontent.com/102238922/232652875-2fa5f9a9-17fa-48c8-b3de-4bdf87ae842f.png)

As a new rookie of the team, I am so glad that I've joined this party. To let more people know what we did to make Vite4.3 so fast, we are happy to share the experience.

## Smarter resolve strategy

Vite resolves all the received urls and paths in order to get the target modules.

In Vite4.2, there are many **redundant resolve logics and unnecessary module searches**. Vite4.3 makes the resolve logic **simpler**, **stricter** and **more accurate** to reduce calculations and `fs` calls.

### Resolve simpler

Vite4.2 heavily depends on the [resolve](https://www.npmjs.com/package/resolve) package to resolve dependency's `package.json`, when we looked into the source code of [resolve](https://www.npmjs.com/package/resolve), there were many useless logic while resolving `package.json`. Vite4.3 abandons [resolve](https://www.npmjs.com/package/resolve) and follows the simpler resolve logic: directly check whether `package.json` exists in the nested parents' directory.

### Resolve stricter

Vite has to call the nodejs `fs` APIs to find the module. But IO is expensive. Vite4.3 narrows the file search and skips searching some special paths in order to reduce the `fs` calls as much as possible. e.g:

1. Since `#` symbol would not appear in urls and users could control that no `#` symbol in the source files' paths, Vite4.3 no longer checks paths with `#` symbol inside user's own source files but only searches them in the `node_modules`.
2. In unix systems, Vite4.2 checks each absolute path inside the root directory first, it's fine for most paths, but it would be very likely to fail if the absolute path starts with root. To skip searching `/root/root/path-to-file` while `/root/root` doesn't exist, Vite4.3 judges whether `/root/root` exists as a directory at the beginning and pre-caches the result.
3. When Vite server receives `@fs/xxx` and `@vite/xxx`, it would be unnecessary to resolve this urls again. Vite4.3 directly returns the previous cached result instead re-resolving them.
4. Vite4.2 uses absolute file paths as the package datas cache keys. That's not enough since Vite has to traverse the same directory both in `pkg/foo/bar` and  `pkg/foo/baz`. <br>Vite4.3 uses not only the absolute paths(`/root/node_modules/pkg/foo/bar.js` & `/root/node_modules/pkg/foo/baz.js`) but also the traversed directories(`/root/node_modules/pkg/foo` & `/root/node_modules/pkg`) as the keys of `pkg` cache.

### Resolve more accurate

Vite4.2 recursively resolves the module when the file path is a directory, this would lead to unnecessary calculations repeatedly. Vite4.3 flattens the recursive resolution and applies appropriate resolution to different type paths. It's also easier to cache some `fs` calls after flattening.

Another case is that Vite4.2 looks up `package.json` of a deep import path inside a single function, e.g when Vite4.2 resolves a file path like `a/b/c/d`, it first checks whether root `a/package.json` exists, if not, then finds the nearest `package.json` in the order `a/b/c/package.json` -> `a/b/package.json`, but the fact is that finding root `package.json` and nearest `package.json` should be handled separately since they are needed in different resolve contexts. Vite4.3 splits the root `package.json` and nearest `package.json` resolution in two parts so that they won't mix with each other.

## Non-blocking tasks

As an on-demand service, Vite dev server can be started without all the stuff being ready.

### Non-blocking `tsconfig` parsing

Vite server needs `tsconfig` data when pre-bundling `ts` or `tsx`. Vite4.2 waits `tsconfig` data being resolved in the plugin hook `configResolved`, this might increase the server start up time. 

### Delay optimizer 

### Non-blocking file processing

## HMR cache

Consider a simple dependency chain `root <- B <- A`, when `A` is edited, HMR will propagate from `A` to `root`. Most of the time, users edit single file once a time. In some special cases like `git checkout branch`, there might be plenty of files change at the same time, this will cause duplicate HMR propagation from `B` to `root`. In Vite4.3, we cache the files in each HMR propagation chain so that they could be skipped in other HMR propagation chains.

## Parallelization

Parallelization is always a good choice for better performance. In Vite4.3, we parallelized [imports analysis](https://github.com/vitejs/vite/pull/12754/files), [extract deps' exports](https://github.com/vitejs/vite/pull/12869/files) and [resolve module urls](https://github.com/vitejs/vite/pull/12619/files).

## Javascript optimization

Do not miss programming language optimization. Some interesting javascript optimization cases in Vite4.3:

### Substitute `*yield` with callback

Vite uses [tsconfck](https://github.com/dominikg/tsconfck)(by [@dominikg](https://github.com/dominikg)) to find and parse `tsconfig` files. [tsconfck](https://github.com/dominikg/tsconfck) used to walk the target directory via `*yield`, one disadvantage of generator is that it needs more memory spaces to store its `Generator` object and there would be plenty of generator context switches in the runtime. So [@dominikg](https://github.com/dominikg) substituted `*yield` with callback in the core since v2.1.1.

Check more details [here](https://github.com/dominikg/tsconfck/pull/84/files).

### Substitute `startsWith` & `endsWith` with `===`

We also noticed that Vite4.2 uses `startsWith` and `endsWith` to check the heading and trailing `'/'` in hot urls. We compared `str.startsWith('x')`'s and `str[0] === 'x'`'s execution benchmarks and found `===` was about ~20% faster than `startsWith`. And `endsWith` was about ~60% slower than `===` in the meantime.

### Avoid recreating regular expression

Vite needs a lot of regular expressions to match strings, most of them are static, it would be much better to only use their singletons. Vite4.3 hoists regular expressions so they could be reused.

## Inch by inch

> Rome wasn't built in a day

So was Vite4.3.

We made a lot of big or small efforts to optimize the performance as much as possible. Finally we made it!

If you are interesting in more of what we did, see [CHANGELOG](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) here.

**Looking forward to sharing with us your Vite4.3 stories.**


## Benchmark ecosystem

- [vite-benchmark](https://github.com/vitejs/vite-benchmark)(by [@fi3ework](https://github.com/fi3ework)): vite uses this repo to test every commit's benchmark, if you are developing a large project with vite, we are happy to test your repo for a more comprehensively performance.
- [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)(by [@antfu](https://github.com/antfu)): vite-plugin-inspect supports to show the plugins' hook time since v0.7.20, and there will be more benchmark graphs in the future, let us know what you need.
- [vite-plugin-warmup](https://github.com/bluwy/vite-plugin-warmup)(by [@bluwy](https://github.com/bluwy)): warm up your vite server, speed up the page loading!



