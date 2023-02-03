import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should send overwritten accept header and should not be case sensitive', async () => {
  let accept: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    accept = request.headers['accept'];

    response.end();
  });

  await HttpClient
    .request({
      headers: {
        // case-insensitive
        'aCcEpT': 'application/json',
      },
      method: 'GET',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(accept).toBe('application/json');
});
