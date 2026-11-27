import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  const isSingle = mode === 'single';

  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      ...(isSingle ? [viteSingleFile()] : []),
    ],
    ...(isSingle
      ? {}
      : {
          build: {
            rollupOptions: {
              output: {
                manualChunks(id) {
                  if (id.includes('node_modules/@supabase/')) {
                    return 'supabase';
                  }
                  if (id.includes('node_modules/lucide-react/')) {
                    return 'icons';
                  }
                  if (
                    id.includes('node_modules/react/') ||
                    id.includes('node_modules/react-dom/')
                  ) {
                    return 'react-vendor';
                  }
                  return undefined;
                },
              },
            },
          },
        }),
  };
});
