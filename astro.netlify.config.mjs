import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://heyhonjamaica.com',
  output: 'server',
  adapter: netlify({
    imageCDN: false,
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
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
