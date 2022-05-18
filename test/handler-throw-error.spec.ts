import http from 'http';
import supertest from 'supertest';
import { HttpRouter } from '../src';

it('should correctly handle Error threw by handler', async () => {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .route({
      handler: () => {
        throw new Error('Hello Cavia');
      },
      method: 'GET',
      path: '/',
    });

  const httpServer: http.Server = http.createServer(async (request, response) => {
    await httpRouter.handle(request, response);
  });

  const response = await supertest(httpServer)
    .get('/');

  const EXPECTED_BODY = { statusCode: 500, statusMessage: 'Internal Server Error' };

  expect(response.body).toEqual(EXPECTED_BODY);
  expect(response.headers['content-length']).toBe(Buffer.byteLength(JSON.stringify(EXPECTED_BODY)).toString());
  expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(response.statusCode).toBe(500);
});
