import { Readable } from 'stream';
import { URL } from 'url';
import isStream from 'is-stream';
import https from 'https';
import http from 'http';
import zlib from 'zlib';

const DEFAULT_HTTP_OPTIONS: Partial<HttpOptions> = {
  responseType: 'buffer',
};

export class HttpClient {
  public static async request(options: HttpOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public static async request<T = any>(options: HttpOptions & { responseType?: 'json'; }): Promise<HttpResponse<T>>;
  public static async request(options: HttpOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public static async request(options: HttpOptions & { responseType?: 'text'; }): Promise<HttpResponse<string>>;
  public static async request(options: HttpOptions & { responseType?: any; }): Promise<HttpResponse>;
  public static async request(options: HttpOptions): Promise<HttpResponse> {
    options = { ...DEFAULT_HTTP_OPTIONS, ...options };

    const requestOptions: https.RequestOptions = this.getRequestOptions(options);

    if (!requestOptions.headers['Accept-Encoding']) {
      requestOptions.headers['Accept-Encoding'] = 'gzip, deflate';
    }

    if (!requestOptions.headers['Accept']) {
      requestOptions.headers['Accept'] = '*/*';
    }

    if (!requestOptions.headers['Content-Length']) {
      const contentLength: number | undefined = this.getContentLength(options.body);

      if (typeof contentLength === 'number') {
        requestOptions.headers['Content-Length'] = contentLength;
      }
    }

    if (!requestOptions.headers['Content-Type']) {
      const contentType: string | undefined = await this.getContentType(options.body);

      if (typeof contentType === 'string') {
        requestOptions.headers['Content-Type'] = contentType;
      }
    }

    return new Promise<HttpResponse>((resolve, reject) => {
      const request = (requestOptions.protocol === 'https:' ? https : http)
        .request(requestOptions, (response: http.IncomingMessage) => {
          if (response.headers['content-encoding'] === 'gzip') {
            response.pipe(zlib.createGunzip());
          } else if (response.headers['content-encoding'] === 'deflate') {
            response.pipe(zlib.createInflate());
          }

          if (options.responseType === 'stream') {
            return resolve({
              body: response,
              headers: response.headers,
              statusCode: response.statusCode,
              statusMessage: response.statusMessage,
            });
          }

          let data: Buffer = Buffer.alloc(0);

          response.on('data', (chunk: Buffer) => {
            data = Buffer.concat([data, chunk]);
          });

          response.on('end', () => {
            let responseBody: any;

            switch (options.responseType) {
              case 'buffer':
                responseBody = data;
                break;
              case 'json':
                try {
                  responseBody = JSON.parse(data.toString());
                } catch (error) {
                  return reject(error);
                }
                break;
              case 'text':
                responseBody = data.toString();
                break;
            }

            // all http statuses should be treated as resolved (1xx-5xx)
            resolve({
              body: responseBody,
              headers: response.headers,
              statusCode: response.statusCode,
              statusMessage: response.statusMessage,
            });
          });
        });

      request.on('socket', socket => {
        if (typeof options.timeout === 'number') {
          if (socket.connecting) {
            // Only start the connection timer if we're actually connecting a new
            // socket, otherwise if we're already connected (because this is a
            // keep-alive connection) do not bother. This is important since we won't
            // get a 'connect' event for an already connected socket.

            const timeoutId = setTimeout(() => {
              // A connect timeout occurs if the timeout is
              // hit while Particle is attempting to establish
              // a connection to a remote machine (the webhook destination)
              request.abort();
              request.emit('error', new Error('ETIMEDOUT'));
            }, options.timeout);

            socket.on('connect', () => clearTimeout(timeoutId));
            socket.on('error', () => clearTimeout(timeoutId));
          }
        }
      });

      request.on('error', error => {
        // all exceptions (e.g. network errors) should be treated as rejected
        // and caught by a try-catch block
        reject(error);
      });

      // request.on('timeout', () => {
      //   // A read timeout occurs any time the server is too slow to send back a part of the response.
      //   request.abort();
      //   request.emit('error', new Error('ESOCKETTIMEDOUT'));
      // });

      if (options.body === undefined) {
        request.end();
      } else if (Buffer.isBuffer(options.body)) {
        request.write(options.body);
        request.end();
      } else if (isStream(options.body)) {
        options.body.pipe(request);
      } else if (typeof options.body === 'string') {
        request.write(options.body);
        request.end();
      } else if (typeof options.body === 'boolean' || typeof options.body === 'number' || typeof options.body === 'object') {
        // JSON (true, false, number, null, array, object) but without string
        request.write(JSON.stringify(options.body));
        request.end();
      } else {
        request.end();
      }
    });
  }

  protected static getContentLength(body: HttpBody): number | undefined {
    if (body === undefined) {
      return undefined;
    } else if (Buffer.isBuffer(body)) {
      return body.length;
    } else if (isStream(body)) {
      return undefined;
    } else if (typeof body === 'string') {
      return Buffer.byteLength(body);
    } else if (typeof body === 'boolean' || typeof body === 'number' || typeof body === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      return Buffer.byteLength(JSON.stringify(body));
    } else {
      return undefined;
    }
  }

  protected static async getContentType(body: HttpBody): Promise<string | undefined> {
    if (body === undefined) {
      return undefined;
    } else if (Buffer.isBuffer(body)) {
      return 'application/octet-stream';
    } else if (isStream(body)) {
      return 'application/octet-stream';
    } else if (typeof body === 'string') {
      return 'text/plain';
    } else if (typeof body === 'boolean' || typeof body === 'number' || typeof body === 'object') {
      // JSON (true, false, number, null, array, object) but without string
      return 'application/json; charset=utf-8';
    }
  }

  protected static getRequestOptions(options: HttpOptions): https.RequestOptions {
    const requestUrl: URL = options.url instanceof URL ? options.url : new URL(options.url);

    return {
      host: requestUrl.hostname,
      port: requestUrl.port,
      protocol: requestUrl.protocol,
      path: `${ requestUrl.pathname }${ requestUrl.search === null ? '' : requestUrl.search }`,
      headers: { ...options.headers },
      timeout: options.timeout,
      method: options.method.toUpperCase(),
    };
  }
}

export interface HttpOptions {
  body?: HttpBody;
  headers?: { [key: string]: string | number };
  method: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
  responseType?: 'buffer' | 'json' | 'stream' | 'text';
  timeout?: number;
  url: string | URL;
}

export interface HttpResponse<T = any> {
  body: T;
  headers: { readonly [key: string]: string | string[] };
  statusCode: number;
  statusMessage: string;
}

export type HttpBody = undefined | Buffer | Readable | string | boolean | number | null | object;
