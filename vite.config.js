import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dotenv from 'dotenv'
import process from 'process'

// Load environment variables for the backend
dotenv.config()

// Simple Vite plugin to run Vercel serverless functions locally
function vercelApiProxy() {
  return {
    name: 'vercel-api-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/')) {
          try {
            // Read body
            let body = '';
            await new Promise((resolve) => {
              req.on('data', chunk => { body += chunk.toString(); });
              req.on('end', resolve);
            });

            if (body) {
                try {
                    req.body = JSON.parse(body);
                } catch(e) {
                    console.warn('Could not parse request body as JSON', e.message);
                }
            }

            // Dynamically import the handler to get fresh code
            const modulePath = resolve(process.cwd(), `.${req.url.split('?')[0]}.js`);
            const handler = await import(`${modulePath}?t=${Date.now()}`);
            
            // Add basic status and json helpers that Vercel provides
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };

            await handler.default(req, res);
          } catch (e) {
            console.error('API Error:', e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiProxy()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    include: ['src/**/*.test.{js,jsx}'],
  },
})
