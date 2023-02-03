import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should execute the request with the given url - URL instance', async () => {
  let url: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    url = request.url;

    response.end();
  });

  await HttpClient
    .request({
      method: 'POST',
      url: getHttpServerUrl(httpServer, '/guinea-pigs?name=foo'),
    })
    .finally(() => httpServer.close());

  expect(url).toBe('/guinea-pigs?name=foo');
});
