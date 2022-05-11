import * as http from 'http';

declare module 'http' {
  export interface ServerResponse {
    removeCookie(name: string): void;
  }
}

http.ServerResponse.prototype.removeCookie = function (this: http.ServerResponse, name: string): void {
  this.setCookie(name, '', { maxAge: 0, expires: new Date(0) });
};