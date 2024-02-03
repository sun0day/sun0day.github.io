import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lastUpdated: true,
  srcDir: './article',
  outDir: './blog',
  base: '/blog/',
  title: "sun0day - lost in code",
  description: "lost in code",
  head: [
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'blog', link: '/vite/index.html' },
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sun0day' },
      { icon: 'twitter', link: 'https://twitter.com/sun0day500' },
    ]
  }
})
