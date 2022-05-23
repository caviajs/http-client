import zlib from 'zlib';
import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should decompress the encoded content if the content-encoding header is specified - deflate', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    const buffer: Buffer = zlib.deflateSync(Buffer.from('Hello Cavia'));

    // based on this header HttpClient starts decompression
    response.setHeader('content-encoding', 'deflate');
    response.write(buffer);
    response.end();
  });

  const response = await HttpClient
    .request({
      method: 'GET',
      responseType: 'buffer',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(response.body.toString()).toBe('Hello Cavia');
});

it('should not decompress the encoded content if the content-encoding header is not specified - deflate', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    const buffer: Buffer = zlib.deflateSync(Buffer.from('Hello Cavia'));

    // content-encoding header is not specified in the response
    response.write(buffer);
    response.end();
  });

  const response = await HttpClient
    .request({
      method: 'GET',
      responseType: 'buffer',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(response.body.toString()).not.toBe('Hello Cavia');
});
