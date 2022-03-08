import { Token } from '@caviajs/core';

export function isToken(token: any): token is Token {
  return (
    typeof token === 'string'
    ||
    typeof token === 'symbol'
    ||
    (typeof token === 'function' && /^class\s/.test(Function.prototype.toString.call(token)))
  );
}