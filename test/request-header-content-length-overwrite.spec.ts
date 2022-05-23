import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should send overwritten content-length header and should not be case sensitive', async () => {
  let contentLength: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    contentLength = request.headers['content-length'];

    response.end();
  });

  await HttpClient
    .request({
      body: 'Hello Cavia', // Content-Length -> 11
      headers: {
        // case-insensitive
        'coNtEnT-LeNgTh': '1245',
      },
      method: 'POST',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(contentLength).toBe('1245');
});
