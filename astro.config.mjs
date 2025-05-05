import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://puffprovisions.com',
  integrations: [preact(), sitemap()],

  // These were specific redirects we needed for our podcast, if you do not have any routes to redirect, you can safely remove this.
  redirects: {
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: netlify()
});
