import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should use auth if the URL credentials are defined', async () => {
  const httpRequestSpy: jest.SpyInstance = jest.spyOn(http, 'request');

  const httpServer: http.Server = http.createServer((request, response) => {
    response.end();
  });

  const url = new URL('/', getHttpServerUrl(httpServer, '/'));

  url.username = 'foo';
  url.password = 'bar';

  await HttpClient
    .request({
      method: 'GET',
      url: url,
    })
    .finally(() => httpServer.close());

  expect(httpRequestSpy.mock.calls[0][0]).toEqual(expect.objectContaining({ auth: 'foo:bar' }));

  jest.clearAllMocks();
});

it('should use auth if only a username is defined in the URL', async () => {
  const httpRequestSpy: jest.SpyInstance = jest.spyOn(http, 'request');

  const httpServer: http.Server = http.createServer((request, response) => {
    response.end();
  });

  const url = new URL('/', getHttpServerUrl(httpServer, '/'));

  url.username = 'foo';
  // but url.password is not defined

  await HttpClient
    .request({
      method: 'GET',
      url: url,
    })
    .finally(() => httpServer.close());

  expect(httpRequestSpy.mock.calls[0][0]).toEqual(expect.objectContaining({ auth: 'foo:' }));

  jest.clearAllMocks();
});

it('should not use auth if the URL credentials are not defined', async () => {
  const httpRequestSpy: jest.SpyInstance = jest.spyOn(http, 'request');

  const httpServer: http.Server = http.createServer((request, response) => {
    response.end();
  });

  const url = new URL('/', getHttpServerUrl(httpServer, '/'));

  // url.username and url.password are undefined

  await HttpClient
    .request({
      method: 'GET',
      url: url,
    })
    .finally(() => httpServer.close());

  expect(httpRequestSpy.mock.calls[0][0]).toEqual(expect.objectContaining({ auth: undefined }));

  jest.clearAllMocks();
});
