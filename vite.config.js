import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));

export default {
  root,
  publicDir: resolve(root, 'frontend/public'),
  optimizeDeps: {
    entries: [resolve(root, 'index.html')],
    include: ['react', 'react-dom/client'],
  },
  server: {
    host: '127.0.0.1',
    fs: { allow: [root] },
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
  },
};
