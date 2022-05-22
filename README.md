<div align="center">
<h3>@caviajs/http-client</h3>
<p>a micro framework for node.js</p>
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
import { HttpClient } from '@caviajs/http-client';

HttpClient
  .request({
    method: 'GET',
    responseType: 'json',
    url: 'http://localhost:3000/api/users'
  })
  .then(response => {
    // response.body ...
    // response.headers ...
    // response.statusCode ...
    // response.statusMessage ...
  });
```

<div align="center">
<h4>Request body serializing</h4>
</div>

* **buffer** - dumped into the request stream;
  * Content-Type: **[manually specified]** | **application/octet-stream**
  * Content-Length: **[manually specified]** | **[calc buffer length]**
* **stream** - dumped into the request stream,
  * Content-Type: **[manually specified]** | **application/octet-stream**
* **string** - dumped into the request stream,
  * Content-Type: **[manually specified]** | **text/plain**
  * Content-Length: **[manually specified]** | **[calc string byte length]**
* **true, false, number, null, array, object** - parsed by JSON.stringify and dumped into the request stream,
  * Content-Type: **[manually specified]** | **application/json; charset=utf-8**
  * Content-Length: **[manually specified]** | **[calc string byte length]**

<div align="center">
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
