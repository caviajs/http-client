<div align="center">
<h3>@caviajs/http-client</h3>
<p>a micro framework for node.js</p>
</div>

## Introduction

This package includes an `HttpClient` with which you can make HTTP requests.

## Usage

### Installation

```shell
npm install @caviajs/http-client --save
```

### Make an HTTP request

```typescript
import { HttpClient, HttpResponse } from '@caviajs/http-client';

HttpClient
  .request({
    /* 
      agent?: http.Agent | https.Agent;
      body?: HttpBody;
      headers?: { [key: string]: string | number };
      method: 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT';
      responseType?: 'buffer' | 'stream';
      timeout?: number;
      url: string | URL; 
    */
  })
  .then((response: HttpResponse) => {
    // all http statuses are treated as resolved (1xx-5xx)
    
    // response.body ...
    // response.headers ...
    // response.statusCode ...
    // response.statusMessage ...
  })
  .catch((error: Error) => {
    // only exceptions of the kind, e.g. network errors, are treated as thrown
  });
```

#### Request body serialization

The request body that we pass will be automatically serialized in accordance with the specification below.

* `buffer` - dumped into the request stream;
  * `Content-Length`: **[manually specified]** || **[calc buffer length]**
  * `Content-Type`: **[manually specified]** || **application/octet-stream**
* `stream` - dumped into the request stream,
  * `Content-Type`: **[manually specified]** || **application/octet-stream**
* `string` - dumped into the request stream,
  * `Content-Length`: **[manually specified]** || **[calc string byte length]**
  * `Content-Type`: **[manually specified]** || **text/plain**
* `true`, `false`, `number`, `null`, `array`, `object` - parsed by JSON.stringify and dumped into the request stream,
  * `Content-Length`: **[manually specified]** || **[calc string byte length]**
  * `Content-Type`: **[manually specified]** || **application/json; charset=utf-8**

#### Response body decompression

If the `Content-Encoding` header is specified then `HttpClient` will decompress the response.

Supported decompression: `gzip` and `deflate`.
