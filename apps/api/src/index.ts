import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { loadEnv } from './env.js';
import { errorHandler } from './middleware/error-handler.js';
import { authRoutes } from './routes/auth.js';
import { meRoutes } from './routes/me.js';

const env = loadEnv();

const app = new Hono();

app.onError(errorHandler);

app.get('/health', (c) => c.json({ status: 'ok' }));

app.route('/auth', authRoutes);
app.route('/me', meRoutes);

serve({ fetch: app.fetch, port: env.PORT }, ({ port }) => {
  console.log(`summer-body api listening on http://localhost:${port}`);
});
