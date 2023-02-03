import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should send the accept-encoding header by default', async () => {
  let acceptEncoding: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    acceptEncoding = request.headers['accept-encoding'] as string;

    response.end();
  });

  await HttpClient
    .request({
      method: 'GET',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(acceptEncoding).toBe('gzip, deflate');
});
