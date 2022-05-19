import net from 'net';
import http from 'http';
import https from 'https';

export function getHttpServerUrl(server: http.Server | https.Server, url: string): URL {
  if (server.address() === null) {
    server.listen();
  }

  const port = (server.address() as net.AddressInfo).port;
  const protocol = server instanceof https.Server ? 'https' : 'http';

  return new URL(`${ protocol }://127.0.0.1:${ port }/${ url.replace(/^\//, '') }`);
}
