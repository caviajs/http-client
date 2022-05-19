import http from 'http';
import { HttpClient } from '../src';
import { getHttpServerUrl } from './_utils/get-http-server-url';

it('should execute the request with the given headers', async () => {
  let foo: string;
  let bar: string;

  const httpServer: http.Server = http.createServer((request, response) => {
    foo = request.headers['x-foo'] as string;
    bar = request.headers['x-bar'] as string;

    response.end();
  });

  await HttpClient
    .request({
      headers: {
        'x-foo': 'Hello Foo',
        'x-bar': 'Hello Bar',
      },
      method: 'GET',
      url: getHttpServerUrl(httpServer, '/'),
    })
    .finally(() => httpServer.close());

  expect(foo).toBe('Hello Foo');
  expect(bar).toBe('Hello Bar');
});
