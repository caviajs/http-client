import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should throw an error for invalid json', async () => {
  const httpServer: http.Server = http.createServer((request, response) => {
    response.end('Invalid JSON');
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
    expect(error).toBeInstanceOf(Error);
  }
});
