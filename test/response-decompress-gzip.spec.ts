import zlib from 'zlib';
import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should decompress the encoded content - gzip', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    const buffer: Buffer = zlib.gzipSync(Buffer.from('Hello Cavia'));

    response.setHeader('content-encoding', 'gzip');
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
