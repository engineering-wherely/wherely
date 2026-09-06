import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { globSync } from 'glob';
import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const externalPackages = [/^react($|\/)/, /^react-dom($|\/)/];
const libraryEntries = {
  'client-components': resolve(__dirname, 'src/client-components.ts'),
  hooks: resolve(__dirname, 'src/hooks.ts'),
  slices: resolve(__dirname, 'src/slices.ts'),
  types: resolve(__dirname, 'src/types.ts'),
  utils: resolve(__dirname, 'src/utils.ts'),
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      tsconfigPath: './tsconfig.app.json',
      exclude: ['**/*.stories.tsx', 'src/test', '**/*.test.tsx'],
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    lib: {
      entry: libraryEntries,
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => externalPackages.some((externalPackage) => externalPackage.test(id)),
      input: {
        ...libraryEntries,
        style: resolve(__dirname, 'src/style.css'),
        ...Object.fromEntries(
          globSync(['src/components/**/index.tsx']).map((file) => {
            const entryName = path.relative(
              'src',
              file.slice(0, file.length - path.extname(file).length)
            );
            const entryUrl = fileURLToPath(new URL(file, import.meta.url));
            return [entryName, entryUrl];
          })
        ),
      },
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) =>
          assetInfo.names?.includes('style.css') ? '[name][extname]' : 'assets/[name][extname]',
        globals: {
          react: 'React',
          'react-dom': 'React-dom',
          'reaxt/jsx-runtime': 'react/jsx-runtime',
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      include: ['src/components'],
      exclude: ['**/*.stories.tsx'],
    },
  },
});
