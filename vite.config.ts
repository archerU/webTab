import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, readFileSync, writeFileSync, existsSync } from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir: 'dist',
        rollupOptions: {
          input: path.resolve(__dirname, 'index.html'),
        },
      },
      plugins: [
        react(),
        {
          name: 'copy-manifest',
          closeBundle() {
            copyFileSync(
              path.resolve(__dirname, 'manifest.json'),
              path.resolve(__dirname, 'dist/manifest.json')
            );
            copyFileSync(
              path.resolve(__dirname, 'background.js'),
              path.resolve(__dirname, 'dist/background.js')
            );
            // Copy icon files if they exist
            const iconSizes = [16, 48, 128];
            iconSizes.forEach(size => {
              const iconPath = path.resolve(__dirname, `icon-${size}.png`);
              if (existsSync(iconPath)) {
                copyFileSync(iconPath, path.resolve(__dirname, `dist/icon-${size}.png`));
              }
            });
            // Fix absolute paths in HTML for Chrome extension
            const htmlPath = path.resolve(__dirname, 'dist/index.html');
            let html = readFileSync(htmlPath, 'utf-8');
            // Replace absolute paths with relative paths (match various quote styles)
            html = html.replace(/src=["']\/assets\//g, (match) => match.replace('/assets/', './assets/'));
            html = html.replace(/href=["']\/assets\//g, (match) => match.replace('/assets/', './assets/'));
            // Remove CDN scripts and inline scripts for CSP compliance
            html = html.replace(/<script\s+src=["']https:\/\/cdn\.tailwindcss\.com["']\s*><\/script>\s*/gi, '');
            html = html.replace(/<script\s+type=["']importmap["']>[\s\S]*?<\/script>\s*/gi, '');
            html = html.replace(/<script>[\s\S]*?tailwind\.config[\s\S]*?<\/script>\s*/gi, '');
            writeFileSync(htmlPath, html, 'utf-8');
          },
        },
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
