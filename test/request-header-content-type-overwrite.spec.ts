import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should send overwritten content-type header and should not be case sensitive', async () => {
  let contentType: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    contentType = request.headers['content-type'];

    response.end();
  });

  await HttpClient
    .request({
      body: 'Hello Cavia', // Content-Type -> text/plain
      headers: {
        // case-insensitive
        'coNtEnT-TypE': 'x-cavia',
      },
      method: 'POST',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(contentType).toBe('x-cavia');
});
