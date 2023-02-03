import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should send overwritten accept-encoding header and should not be case sensitive', async () => {
  let acceptEncoding: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    acceptEncoding = request.headers['accept-encoding'] as string;

    response.end();
  });

  await HttpClient
    .request({
      headers: {
        // case-insensitive
        'aCcEpt-encOdiNg': '*',
      },
      method: 'GET',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(acceptEncoding).toBe('*');
});
