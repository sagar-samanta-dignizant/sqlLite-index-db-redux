import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process
        entry: 'electron/main.ts',
        onstart(options) {
          options.startup();
        },
        vite: {
          build: {
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['better-sqlite3', 'electron']
            }
          }
        }
      }
      // Preload removed - we'll copy it manually to avoid transpilation
    ]),
    renderer(),
    {
      name: 'copy-preload',
      buildStart() {
        // Copy preload.cjs directly without transpiling
        const src = resolve(__dirname, 'electron/preload.cjs');
        const dest = resolve(__dirname, 'dist-electron/preload.cjs');
        
        // Ensure dist-electron exists
        const destDir = dirname(dest);
        if (!existsSync(destDir)) {
          mkdirSync(destDir, { recursive: true });
        }
        
        // Copy file
        copyFileSync(src, dest);
        console.log('✅ Copied preload.cjs to dist-electron');
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173
  }
});
