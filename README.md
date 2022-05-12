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
  <sub>Built with ❤︎ by <a href="https://partyka.dev">Paweł Partyka</a></sub>
</div>
