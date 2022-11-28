import fetch from 'node-fetch';
import base from '../config/base';

export default async function (method: string, params: any) {
  const response = await fetch(base.gear.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 100),
      method,
      params,
    }),
  });
  const responseData: any = await response.json();
  return responseData;
}

export async function batchRequest(method: string, params: any) {
  const response = await fetch(base.gear.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 100),
        method,
        params,
      },
    ]),
  });
  const responseData: any = await response.json();
  return responseData;
}
