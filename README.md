<div align="center">
<h3>@caviajs/http-client</h3>
<p>ecosystem for your guinea pig</p>
</div>

<div align="center">
<h4>Installation</h4>
</div>

```shell
npm install @caviajs/http-client --save
```

<div align="center">
<h4>Usage</h4>
</div>

```typescript
import { HttpClient, HttpOptions, HttpResponse } from '@caviajs/http-client';

const options: HttpOptions = {
  method: 'GET',
  responseType: 'buffer',
  url: 'http://localhost:3000/api/users'
};

HttpClient
  .request(options)
  .then((response: HttpResponse) => {
    // response.body ...
    // response.headers ...
    // response.statusCode ...
    // response.statusMessage ...
  });
```

<div align="center">
<h4>Request body serialization</h4>
</div>

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
  
<div align="center">
<h4>Response body decompression</h4>
</div>

If the `Content-Encoding` header is specified then HttpClient starts decompression. 
Supported decompression: `gzip` and `deflate`.

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
