import{_ as e,o as t,c as o,M as a}from"./chunks/framework.0a4c9d35.js";const r="/blog/assets/vite4_3-startup.dedb6ae2.png",s="/blog/assets/vite4_3-hmr.0bff8965.png",b=JSON.parse('{"title":"How we made Vite 4.3 faaaaster 🚀","description":"","frontmatter":{"sidebar":false,"head":[["meta",{"property":"og:type","content":"website"}],["meta",{"property":"og:title","content":"How we made Vite 4.3 faaaaster"}],["meta",{"property":"og:image","content":"https://user-images.githubusercontent.com/102238922/233404924-2ad437dc-ff93-40fe-b9c6-53f9197f25b9.png"}],["meta",{"property":"twitter:image:src","content":"https://user-images.githubusercontent.com/102238922/233404924-2ad437dc-ff93-40fe-b9c6-53f9197f25b9.png"}],["meta",{"property":"og:url","content":"https://sun0day.github.io/blog/vite/why-vite4_3-is-faster.html"}],["meta",{"property":"og:description","content":"Just like @sapphi-red said, Vite 4.3 has made amazing performance improvements over Vite 4.2"}],["meta",{"name":"twitter:card","content":"summary_large_image"}]]},"headers":[],"relativePath":"vite/why-vite4_3-is-faster.md","lastUpdated":1682003474000}'),i={name:"vite/why-vite4_3-is-faster.md"},n=a('<h1 id="how-we-made-vite-4-3-faaaaster" tabindex="-1">How we made Vite 4.3 faaaaster 🚀 <a class="header-anchor" href="#how-we-made-vite-4-3-faaaaster" aria-label="Permalink to &quot;How we made Vite 4.3 faaaaster :rocket:&quot;">​</a></h1><p>Just like <a href="https://github.com/sapphi-red/" target="_blank" rel="noreferrer">@sapphi-red</a> said, Vite 4.3 has made <a href="https://gist.github.com/sapphi-red/25be97327ee64a3c1dce793444afdf6e" target="_blank" rel="noreferrer">amazing performance improvements</a> over Vite 4.2.</p><p><img src="'+r+'" alt=""><img src="'+s+'" alt=""></p><blockquote><p>These benchmarks based on a large project with 1000 react components. And these react components were transformed by <a href="https://github.com/vitejs/vite-plugin-react" target="_blank" rel="noreferrer">vite-plugin-react</a> and <a href="https://github.com/vitejs/vite-plugin-react-swc" target="_blank" rel="noreferrer">vite-plugin-react-swc</a>.</p></blockquote><p>As a new rookie on the team, I am so glad that I&#39;ve joined this party. To let more people know what we did to make Vite 4.3 so fast, we are happy to share the experience.</p><h2 id="smarter-resolve-strategy" tabindex="-1">Smarter resolve strategy <a class="header-anchor" href="#smarter-resolve-strategy" aria-label="Permalink to &quot;Smarter resolve strategy&quot;">​</a></h2><p>Vite resolves all the received URLs and paths to get the target modules.</p><p>In Vite 4.2, there are many <strong>redundant resolve logics and unnecessary module searches</strong>. Vite 4.3 makes the resolve logic <strong>simpler</strong>, <strong>stricter</strong> and <strong>more accurate</strong> to reduce calculations and <code>fs</code> calls.</p><h3 id="a-simpler-resolve" tabindex="-1">A simpler resolve <a class="header-anchor" href="#a-simpler-resolve" aria-label="Permalink to &quot;A simpler resolve&quot;">​</a></h3><p>Vite 4.2 heavily depends on the <a href="https://www.npmjs.com/package/resolve" target="_blank" rel="noreferrer">resolve</a> package to resolve the dependency&#39;s <code>package.json</code>, when we looked into the source code of <a href="https://www.npmjs.com/package/resolve" target="_blank" rel="noreferrer">resolve</a>, there was much useless logic while resolving <code>package.json</code>. Vite 4.3 abandons <a href="https://www.npmjs.com/package/resolve" target="_blank" rel="noreferrer">resolve</a> and follows the simpler resolve logic: directly checks whether <code>package.json</code> exists in the nested parents&#39; directories.</p><h3 id="a-stricter-resolve" tabindex="-1">A stricter resolve <a class="header-anchor" href="#a-stricter-resolve" aria-label="Permalink to &quot;A stricter resolve&quot;">​</a></h3><p>Vite has to call the Nodejs <code>fs</code> APIs to find the module. But IO is expensive. Vite 4.3 narrows the file search and skips searching some special paths in order to reduce the <code>fs</code> calls as much as possible. e.g:</p><ol><li>Since <code>#</code> symbol would not appear in URLs and users could control that no <code>#</code> symbol in the source files&#39; paths, Vite 4.3 no longer checks paths with <code>#</code> symbol inside the user&#39;s source files but only searches them in the <code>node_modules</code>.</li><li>In Unix systems, Vite 4.2 checks each absolute path inside the root directory first, it&#39;s fine for most paths, but it would be very likely to fail if the absolute path starts with the root. To skip searching <code>/root/root/path-to-file</code> while <code>/root/root</code> doesn&#39;t exist, Vite 4.3 judges whether <code>/root/root</code> exists as a directory at the beginning and pre-caches the result.</li><li>When Vite server receives <code>@fs/xxx</code> and <code>@vite/xxx</code>, it would be unnecessary to resolve these URLs again. Vite 4.3 directly returns the previously cached result instead of re-resolving them.</li></ol><h3 id="a-more-accurate-resolve" tabindex="-1">A more accurate resolve <a class="header-anchor" href="#a-more-accurate-resolve" aria-label="Permalink to &quot;A more accurate resolve&quot;">​</a></h3><p>Vite 4.2 recursively resolves the module when the file path is a directory, this would lead to unnecessary calculations repeatedly. Vite 4.3 flattens the recursive resolution and applies appropriate resolution to different types of paths. It&#39;s also easier to cache some <code>fs</code> calls after flattening.</p><h3 id="package-package-package" tabindex="-1">Package package package <a class="header-anchor" href="#package-package-package" aria-label="Permalink to &quot;Package package package&quot;">​</a></h3><p>Thanks to <a href="https://github.com/bluwy" target="_blank" rel="noreferrer">@bluwy</a>&#39;s nice work, Vite 4.3 breaks the performance bottleneck of resolving <code>node_modules</code> package data.</p><p>Vite 4.2 uses absolute file paths as the package data cache keys. That&#39;s not enough since Vite has to traverse the same directory both in <code>pkg/foo/bar</code> and <code>pkg/foo/baz</code>. <br>Vite 4.3 uses not only the absolute paths(<code>/root/node_modules/pkg/foo/bar.js</code> &amp; <code>/root/node_modules/pkg/foo/baz.js</code>) but also the traversed directories(<code>/root/node_modules/pkg/foo</code> &amp; <code>/root/node_modules/pkg</code>) as the keys of <code>pkg</code> cache.</p><p>Another case is that Vite 4.2 looks up <code>package.json</code> of a deep import path inside a single function, e.g when Vite 4.2 resolves a file path like <code>a/b/c/d</code>, it first checks whether root <code>a/package.json</code> exists, if not, then finds the nearest <code>package.json</code> in the order <code>a/b/c/package.json</code> -&gt; <code>a/b/package.json</code>, but the fact is that finding root <code>package.json</code> and nearest <code>package.json</code> should be handled separately since they are needed in different resolve contexts. Vite 4.3 splits the root <code>package.json</code> and nearest <code>package.json</code> resolution in two parts so that they won&#39;t mix.</p><h2 id="fs-realpathsync-issue" tabindex="-1"><code>fs.realpathSync</code> issue <a class="header-anchor" href="#fs-realpathsync-issue" aria-label="Permalink to &quot;`fs.realpathSync` issue&quot;">​</a></h2><p>There was an interesting <a href="https://github.com/nodejs/node/issues/2680" target="_blank" rel="noreferrer"><code>realpathSync</code> issue</a> in Nodejs, it pointed out that <code>fs.realpathSync</code> is 70x slower than <code>fs.realpathSync.native</code>.</p><p>But Vite 4.2 only uses <code>fs.realpathSync.native</code> on non-Windows systems due to its <a href="https://github.com/nodejs/node/issues/37737" target="_blank" rel="noreferrer">different behavior on Windows</a>. To fix that, Vite 4.3 adds a network drive validation when calling <code>fs.realpathSync.native</code> on Windows.</p><p>You can check more details <a href="https://github.com/vitejs/vite/pull/12580" target="_blank" rel="noreferrer">here</a>.</p><blockquote><p>Vite never gives up on Windows 🔥</p></blockquote><h2 id="non-blocking-tasks" tabindex="-1">Non-blocking tasks <a class="header-anchor" href="#non-blocking-tasks" aria-label="Permalink to &quot;Non-blocking tasks&quot;">​</a></h2><p>As an on-demand service, Vite dev server can be started without all the stuff being ready.</p><h3 id="non-blocking-tsconfig-parsing" tabindex="-1">Non-blocking <code>tsconfig</code> parsing <a class="header-anchor" href="#non-blocking-tsconfig-parsing" aria-label="Permalink to &quot;Non-blocking `tsconfig` parsing&quot;">​</a></h3><p>Vite server needs <code>tsconfig</code> data when pre-bundling <code>ts</code> or <code>tsx</code>.</p><p>Vite 4.2 waits for <code>tsconfig</code> data to be parsed in the plugin hook <code>configResolved</code> before the server starts up. Page requests could visit the server once the server starts up without <code>tsconfig</code> data ready even though the request might need to wait for the <code>tsconfig</code> parsing later.</p><p>Vite 4.3 inits <code>tsconfig</code> parsing before the server starts up, but the server won&#39;t wait for it. The parsing process runs in the background. Once a <code>ts</code>-related request comes in, it will have to wait until the <code>tsconfig</code> parsing is finished.</p><h3 id="non-blocking-file-processing" tabindex="-1">Non-blocking file processing <a class="header-anchor" href="#non-blocking-file-processing" aria-label="Permalink to &quot;Non-blocking file processing&quot;">​</a></h3><p>There are plenty of <code>fs</code> calls in Vite, and some of them are synchronous. These synchronous <code>fs</code> calls may block the main thread. Vite 4.3 changes them to asynchronous. Also, it&#39;s easier to parallelize the asynchronous functions. One thing about asynchronous functions you should care about is that there might be many <code>Promise</code> objects to be released after they are resolved. Thanks to the smarter resolve strategy, the cost of releasing <code>fs</code>-<code>Promise</code> objects is much less.</p><h2 id="hmr-debouncing" tabindex="-1">HMR debouncing <a class="header-anchor" href="#hmr-debouncing" aria-label="Permalink to &quot;HMR debouncing&quot;">​</a></h2><p>Consider two simple dependency chains <code>C &lt;- B &lt;- A</code> &amp; <code>D &lt;- B &lt;- A</code>, when <code>A</code> is edited, HMR will propagate both from <code>A</code> to <code>C</code> and <code>A</code> to <code>D</code>. This leads to <code>A</code> and <code>B</code> being updated twice in Vite 4.2.</p><p>Vite 4.3 caches these traversed modules to avoid exploring them multiple times. This could have a big impact on those file structures with components barrel importing. It&#39;s also good for HMR triggered by <code>git checkout</code>.</p><h2 id="parallelization" tabindex="-1">Parallelization <a class="header-anchor" href="#parallelization" aria-label="Permalink to &quot;Parallelization&quot;">​</a></h2><p>Parallelization is always a good choice for better performance. In Vite 4.3, we parallelized some core features includes <a href="https://github.com/vitejs/vite/pull/12754/files" target="_blank" rel="noreferrer">imports analysis</a>, <a href="https://github.com/vitejs/vite/pull/12869/files" target="_blank" rel="noreferrer">extract deps&#39; exports</a>, <a href="https://github.com/vitejs/vite/pull/12619/files" target="_blank" rel="noreferrer">resolve module urls</a> and <a href="https://github.com/vitejs/vite/pull/12609/files" target="_blank" rel="noreferrer">run bulk optimizers</a>. There is indeed an impressive improvement after parallelization.</p><h2 id="javascript-optimization" tabindex="-1">Javascript optimization <a class="header-anchor" href="#javascript-optimization" aria-label="Permalink to &quot;Javascript optimization&quot;">​</a></h2><p>Do not miss programming language optimization. Some interesting javascript optimization cases in Vite 4.3:</p><h3 id="substitute-yield-with-callback" tabindex="-1">Substitute <code>*yield</code> with callback <a class="header-anchor" href="#substitute-yield-with-callback" aria-label="Permalink to &quot;Substitute `*yield` with callback&quot;">​</a></h3><p>Vite uses <a href="https://github.com/dominikg/tsconfck" target="_blank" rel="noreferrer">tsconfck</a>(by <a href="https://github.com/dominikg" target="_blank" rel="noreferrer">@dominikg</a>) to find and parse <code>tsconfig</code> files. <a href="https://github.com/dominikg/tsconfck" target="_blank" rel="noreferrer">tsconfck</a> used to walk the target directory via <code>*yield</code>, one disadvantage of the generator is that it needs more memory spaces to store its <code>Generator</code> object and there would be plenty of generator context switches in the runtime. So <a href="https://github.com/dominikg" target="_blank" rel="noreferrer">@dominikg</a> substituted <code>*yield</code> with callback in the core since v2.1.1.</p><p>Check more details <a href="https://github.com/dominikg/tsconfck/pull/84/files" target="_blank" rel="noreferrer">here</a>.</p><h3 id="substitute-startswith-endswith-with" tabindex="-1">Substitute <code>startsWith</code> &amp; <code>endsWith</code> with <code>===</code> <a class="header-anchor" href="#substitute-startswith-endswith-with" aria-label="Permalink to &quot;Substitute `startsWith` &amp; `endsWith` with `===`&quot;">​</a></h3><p>We also noticed that Vite 4.2 uses <code>startsWith</code> and <code>endsWith</code> to check the heading and trailing <code>&#39;/&#39;</code> in hot URLs. We compared <code>str.startsWith(&#39;x&#39;)</code>&#39;s and <code>str[0] === &#39;x&#39;</code>&#39;s execution benchmarks and found <code>===</code> was about ~20% faster than <code>startsWith</code>. And <code>endsWith</code> was about ~60% slower than <code>===</code> in the meantime.</p><h3 id="avoid-recreating-regular-expression" tabindex="-1">Avoid recreating regular expression <a class="header-anchor" href="#avoid-recreating-regular-expression" aria-label="Permalink to &quot;Avoid recreating regular expression&quot;">​</a></h3><p>Vite needs a lot of regular expressions to match strings, most of them are static, so it would be much better to only use their singletons. Vite 4.3 hoists regular expressions so they could be reused.</p><h3 id="abandon-generating-custom-error" tabindex="-1">Abandon generating custom error <a class="header-anchor" href="#abandon-generating-custom-error" aria-label="Permalink to &quot;Abandon generating custom error&quot;">​</a></h3><p>There are some custom errors for better DX in Vite 4.2. Those errors might lead to extra calculation and garbage collection which would slow down Vite. In Vite 4.3, we have to abandon generating some hot custom errors(e.g <code>package.json</code> <code>NOT_FOUND</code> error) and directly throw the original ones for better performance.</p><h2 id="inch-by-inch" tabindex="-1">Inch by inch <a class="header-anchor" href="#inch-by-inch" aria-label="Permalink to &quot;Inch by inch&quot;">​</a></h2><blockquote><p>Rome wasn&#39;t built in a day</p></blockquote><p>So was Vite 4.3.</p><p>We put a lot of big or small efforts to optimize the performance as much as possible. And finally, we made it!</p><p>This article shows the main ideas about how we optimize Vite 4.3. If you are interested in more of what we did, see <a href="https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md" target="_blank" rel="noreferrer">CHANGELOG</a> here.</p><p><strong>Looking forward to sharing with us your Vite 4.3 stories.</strong></p><h2 id="benchmark-ecosystem" tabindex="-1">Benchmark ecosystem <a class="header-anchor" href="#benchmark-ecosystem" aria-label="Permalink to &quot;Benchmark ecosystem&quot;">​</a></h2><ul><li><a href="https://github.com/vitejs/vite-benchmark" target="_blank" rel="noreferrer">vite-benchmark</a>(by <a href="https://github.com/fi3ework" target="_blank" rel="noreferrer">@fi3ework</a>): Vite uses this repo to test every commit&#39;s benchmark, if you are developing a large project with Vite, we are happy to test your repo for more comprehensive performance.</li><li><a href="https://github.com/antfu/vite-plugin-inspect" target="_blank" rel="noreferrer">vite-plugin-inspect</a>(by <a href="https://github.com/antfu" target="_blank" rel="noreferrer">@antfu</a>): vite-plugin-inspect supports showing the plugins&#39; hook time since v0.7.20, and there will be more benchmark graphs in the future, let us know what you need.</li><li><a href="https://github.com/bluwy/vite-plugin-warmup" target="_blank" rel="noreferrer">vite-plugin-warmup</a>(by <a href="https://github.com/bluwy" target="_blank" rel="noreferrer">@bluwy</a>): warm up your Vite server, and speed up the page loading!</li></ul>',56),c=[n];function d(l,h,p,u,g,m){return t(),o("div",null,c)}const k=e(i,[["render",d]]);export{b as __pageData,k as default};
