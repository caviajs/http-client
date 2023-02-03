import zlib from 'zlib';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import { Readable, Stream } from 'stream';

const DEFAULT_HTTP_OPTIONS: Partial<HttpOptions> = {
  responseType: 'buffer',
};

export class HttpClient {
  public static async request(options: HttpOptions & { responseType?: 'buffer'; }): Promise<HttpResponse<Buffer>>;
  public static async request(options: HttpOptions & { responseType?: 'stream'; }): Promise<HttpResponse<Readable>>;
  public static async request(options: HttpOptions & { responseType?: any; }): Promise<HttpResponse>;
  public static async request(options: HttpOptions): Promise<HttpResponse> {
    return new Promise<HttpResponse>((resolve, reject) => {
      options = { ...DEFAULT_HTTP_OPTIONS, ...options };

      const requestOptions: https.RequestOptions = this.getRequestOptions(options);

      if (typeof requestOptions.headers['accept-encoding'] === 'undefined') {
        requestOptions.headers['accept-encoding'] = 'gzip, deflate';
      }

      if (typeof requestOptions.headers['accept'] === 'undefined') {
        requestOptions.headers['accept'] = '*/*';
      }

      if (typeof requestOptions.headers['content-length'] === 'undefined') {
        const contentLength: number | undefined = this.getContentLength(options.body);

        if (typeof contentLength === 'number') {
          requestOptions.headers['content-length'] = contentLength;
        }
      }

      if (typeof requestOptions.headers['content-type'] === 'undefined') {
        const contentType: string | undefined = this.getContentType(options.body);

        if (typeof contentType === 'string') {
          requestOptions.headers['content-type'] = contentType;
        }
      }

      const request = (requestOptions.protocol === 'https:' ? https : http)
        .request(requestOptions, (response: http.IncomingMessage) => {
          let stream: Stream;

          switch (response.headers['content-encoding']?.toLowerCase()) {
            case 'gzip':
              stream = response.pipe(zlib.createGunzip());
              break;
            case 'deflate':
              stream = response.pipe(zlib.createInflate());
              break;
            default:
              stream = response;
              break;
          }

          if (options.responseType === 'stream') {
            return resolve({
              body: stream,
              headers: response.headers,
              statusCode: response.statusCode,
              statusMessage: response.statusMessage,
            });
          }

          let buffer: Buffer = Buffer.alloc(0);

          stream.on('data', (chunk: Buffer) => {
            buffer = Buffer.concat([buffer, chunk]);
          });

          stream.on('end', () => {
            // all http statuses should be treated as resolved (1xx-5xx)
            resolve({
              body: buffer,
              headers: response.headers,
              statusCode: response.statusCode,
              statusMessage: response.statusMessage,
            });
          });
        });

      request.on('socket', socket => {
        if (typeof options.timeout === 'number') {
          const configureReadTimeout = () => {
            request.on('timeout', () => {
              // read timeout occurs when the server is too slow to send back a part of the response
              request.abort();
              request.emit('error', new Error('ESOCKETTIMEDOUT'));
            });
          };

          if (socket.connecting) {
            // only start the connection timer if we are actually connecting a new socket
            const timeoutId = setTimeout(
              () => {
                // connect timeout occurs when a timeout occurs while trying to connect to a remote machine
                request.abort();
                request.emit('error', new Error('ETIMEDOUT'));
              },
              options.timeout,
            );

            socket.on('connect', () => {
              clearTimeout(timeoutId);
              // after establishing the connection, configure the read timeout
              configureReadTimeout();
            });

            socket.on('error', () => {
              clearTimeout(timeoutId);
            });
          } else {
            // configure the read timeout for an already connected socket
            configureReadTimeout();
          }
        }
      });

      request.on('error', error => {
        // all exceptions (e.g. network errors) should be treated as rejected and caught by a try-catch block
        reject(error);
      });

      if (options.body === undefined) {
        request.end();
      } else if (Buffer.isBuffer(options.body)) {
        request.write(options.body);
        request.end();
      } else if (options.body instanceof Readable) {
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
    } else if (body instanceof Readable) {
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

  protected static getContentType(body: HttpBody): string | undefined {
    if (body === undefined) {
      return undefined;
    } else if (Buffer.isBuffer(body)) {
      return 'application/octet-stream';
    } else if (body instanceof Readable) {
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
      agent: options.agent,
      auth: requestUrl.username ? `${ requestUrl.username }:${ requestUrl.password || '' }` : undefined,
      host: requestUrl.hostname,
      port: requestUrl.port,
      protocol: requestUrl.protocol,
      path: `${ requestUrl.pathname }${ requestUrl.search === null ? '' : requestUrl.search }`,
      headers: Object
        .entries(options.headers || {})
        .reduce((prev, [key, value]) => ({ ...prev, [key.toLowerCase()]: value }), {}),
      timeout: options.timeout,
      method: options.method.toUpperCase(),
    };
  }
}

export interface HttpOptions {
  agent?: http.Agent | https.Agent;
  body?: HttpBody;
  headers?: { [key: string]: string | number };
  method: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
  responseType?: 'buffer' | 'stream';
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
