import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should execute the request with the given body - true', async () => {
  let contentType: string;
  let buffer: Buffer = Buffer.alloc(0);

  const httpServer: http.Server = http.createServer((request, response) => {
    contentType = request.headers['content-type'];

    request.on('data', (chunk: Buffer) => {
      buffer = Buffer.concat([buffer, chunk]);
    });

    request.on('end', () => {
      response.end();
    });
  });

  await HttpClient
    .request({
      body: true,
      method: 'POST',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(contentType).toBe('application/json; charset=utf-8');
  expect(buffer.toString()).toBe('true');
});
