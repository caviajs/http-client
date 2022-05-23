import zlib from 'zlib';
import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should decompress the encoded content - deflate', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    const buffer: Buffer = zlib.deflateSync(Buffer.from('Hello Cavia'));

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
