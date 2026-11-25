import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://heyhonjamaica.com',
  output: 'server',
  session: {
    driver: 'memory',
  },
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
    imageService: 'passthrough',
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: import.meta.env.PROD
        ? {
            'react-dom/server': 'react-dom/server.edge',
          }
        : undefined,
    },
  },
  redirects: {
    '/index.html': '/',
    '/shop.html': '/shop',
    '/story.html': '/story',
    '/why-hey-hon.html': '/why-hey-hon',
    '/delivery.html': '/delivery',
    '/recipes.html': '/recipes',
    '/ship-honey-to-usa.html': '/international',
  },
});
