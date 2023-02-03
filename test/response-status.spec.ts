import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should return the appropriate status code and status message', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    response.statusCode = 401;

    response.end();
  });

  const response = await HttpClient
    .request({
      method: 'GET',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(response.statusCode).toBe(401);
  expect(response.statusMessage).toBe('Unauthorized');
});
