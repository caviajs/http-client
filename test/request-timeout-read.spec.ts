import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

function wait(ms: number, cb: () => void): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      cb();
      resolve();
    }, ms);
  });
}

it('should thrown an Error if read timeout occurs', async () => {
  const httpServer: http.Server = http.createServer(async (request, response) => {
    await wait(1000, () => response.end());
  });

  try {
    await HttpClient
      .request({
        method: 'PUT',
        timeout: 500,
        url: getHttpServerUrl(httpServer, '/')
      })
      .finally(() => httpServer.close());
  } catch (error) {
    expect(error.message).toBe('ESOCKETTIMEDOUT');
  }
});
