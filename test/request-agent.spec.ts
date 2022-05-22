import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should use an agent if specified', async () => {
  const httpRequestSpy: jest.SpyInstance = jest.spyOn(http, 'request');

  const httpServer: http.Server = http.createServer((request, response) => {
    response.end();
  });

  const agent: http.Agent = new http.Agent();

  await HttpClient
    .request({
      agent: agent,
      method: 'GET',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(httpRequestSpy.mock.calls[0][0]).toEqual(expect.objectContaining({ agent: agent }));

  jest.clearAllMocks();
});
