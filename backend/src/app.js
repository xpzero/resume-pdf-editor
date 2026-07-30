import Fastify from 'fastify';
import resumeRoutes from './routes/resume.js';

export function buildApp() {
  const app = Fastify({ logger: true });

  app.get('/health', async () => ({ status: 'ok' }));
  app.register(resumeRoutes, { prefix: '/api/resume' });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    if (error.statusCode === 413) {
      return reply.code(413).send({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' } });
    }
    return reply.code(500).send({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error.' } });
  });

  return app;
}
