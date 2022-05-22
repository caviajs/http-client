import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should return correct data - text', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    response.end('Hello Cavia');
  });

  const response = await HttpClient
    .request({
      method: 'GET',
      responseType: 'text',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(response.body).toEqual('Hello Cavia');
});
