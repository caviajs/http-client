import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should return correct data - json', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    response.end(JSON.stringify({ hello: 'cavia' }));
  });

  const response = await HttpClient
    .request({
      method: 'GET',
      responseType: 'json',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(response.body).toEqual({ hello: 'cavia' });
});
