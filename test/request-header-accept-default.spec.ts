import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should send the accept header by default', async () => {
  let accept: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    accept = request.headers['accept'];

    response.end();
  });

  await HttpClient
    .request({
      method: 'GET',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(accept).toBe('*/*');
});
