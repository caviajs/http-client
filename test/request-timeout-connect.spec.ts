import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should thrown an Error if connect timeout occurs', async () => {
  const httpServer: http.Server = http.createServer(async (request, response) => {
    response.end();
  });

  try {
    await HttpClient
      .request({
        agent: new http.Agent({ keepAlive: true }),
        method: 'PUT',
        timeout: 500,
        url: getHttpServerUrl(httpServer, '/'),
      })
      .finally(() => httpServer.close());
  } catch (error) {
    expect(error.message).toBe('ETIMEDOUT');
  }
});
