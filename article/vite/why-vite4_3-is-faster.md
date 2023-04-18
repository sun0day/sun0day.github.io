# Why Vite4.3 is faster?

Just like [@sapphi-red](https://github.com/sapphi-red/) said, Vite4.3 has made an amazing performance improvement than Vite4.2.


![perf](https://user-images.githubusercontent.com/102238922/232652875-2fa5f9a9-17fa-48c8-b3de-4bdf87ae842f.png)

As a new rookie of the team, I am so glad that I've joined this party. To let people that are curious about what we did to to make Vite4.3 so fast, we are happy to share the experience.

## Smarter resolve strategy

### Vite4.2 problem

Vite resolves all the received urls or paths. In Vite4.2, there were many **redundant resolve logics and unnecessary module searches**:

1. Vite4.2 checks paths with `#` symbol both in `node_modules` and user's own source code.
2. In unix systems, Vite4.2 checks each absolute path inside the root directory first, it's fine for most paths, but it would be very likely to fail if the absolute path starts with root.
3. Vite4.2 recursively resolves the module when the file path is a directory, recursion means Vite has to recall the same nested logic again and again.

These will slow down the server response time and building total time.
### Vite4.3 solution

1. Since `#` symbol would not appear in urls and users could control that there is no `#` symbol in the source modules' paths, Vite4.3 only need to search the paths with `#` symbol in `node_modules`.
2. To skip searching `/root/root/path-to-file` while `/root/root` doesn't exist, Vite4.3 judges whether `/root/root` exists as a directory at the beginning and pre-caches the result.
3. Vite4.3 flattens the recursive resolution and applies appropriate resolution to different paths as much as possible. It also caches the results of `fs` related calls to decrease the IO waiting time.

## Benchmark ecosystem

- [vite-benchmark](https://github.com/vitejs/vite-benchmark)(by [@fi3ework](https://github.com/fi3ework)): vite uses this repo to test every commit's benchmark, if you are developing a large project with vite, we are happy to test your repo for a more comprehensively performance.
- [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect)(by [@antfu](https://github.com/antfu)): vite-plugin-inspect supports to show the plugins' hook time since v0.7.20, and there will be more benchmark graphs in the future, let us know what you need.
- [vite-plugin-warmup](https://github.com/bluwy/vite-plugin-warmup)(by [@bluwy](https://github.com/bluwy)): warm up your vite server, speed up the page loading!



