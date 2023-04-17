import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: './article',
  outDir: './blog',
  base: '/blog/',
  title: "sun0day's blog",
  description: "lost in code",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'vite', link: '/vite/index.html' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sun0day' }
    ]
  }
})
