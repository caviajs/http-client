import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should throw an error when trying to parse invalid json', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    response.end(undefined);
  });

  try {
    await HttpClient
      .request({
        method: 'GET',
        responseType: 'json',
        url: getHttpServerUrl(httpServer, '/'),
      })
      .finally(() => httpServer.close());
  } catch (error) {
    expect(error.message).toBe('Unexpected end of JSON input');
  }
});
