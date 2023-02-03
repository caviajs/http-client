import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should return correct data - buffer', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    response.end('Hello Cavia');
  });

  const response = await HttpClient
    .request({
      method: 'GET',
      responseType: 'buffer',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(response.body).toEqual(Buffer.from('Hello Cavia'));
});
