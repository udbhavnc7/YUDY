import { readFileSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { renderWork } from './src/work/renderWork';

function workPage(): Plugin {
  const html = () => renderWork(readFileSync(new URL('./src/work/work.css', import.meta.url), 'utf8'));
  return {
    name: 'work-page',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split('?')[0];
        if ((request.method !== 'GET' && request.method !== 'HEAD') || (path !== '/work' && path !== '/work/')) return next();
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(request.method === 'HEAD' ? undefined : html());
      });
    },
    generateBundle() {
      const source = html();
      this.emitFile({ type: 'asset', fileName: 'work/index.html', source });
      this.emitFile({ type: 'asset', fileName: 'work.html', source });
    },
  };
}

export default defineConfig({
  plugins: [react(), workPage()],
  publicDir: 'assets',
  server: { host: '127.0.0.1', fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/*.docx', '**/content/private/**'] } },
});
