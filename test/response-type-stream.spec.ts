import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should return correct data - stream', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    response.end('Hello Cavia');
  });

  const response = await HttpClient
    .request({
      method: 'GET',
      responseType: 'stream',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  const responseBody = await new Promise((resolve, reject) => {
    let data: Buffer = Buffer.alloc(0);

    response.body.on('error', (error) => {
      reject(error);
    });

    response.body.on('data', (chunk: Buffer) => {
      data = Buffer.concat([data, chunk]);
    });

    response.body.on('end', () => {
      resolve(data.toString());
    });
  });

  expect(responseBody).toEqual('Hello Cavia');
});
