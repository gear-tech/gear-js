import fetch from 'node-fetch';
import base from './config';

export default async function (method: string, params: any) {
  const body = JSON.stringify({ jsonrpc: '2.0', id: Math.floor(Math.random() * 100) + 1, method, params });
  const response = await fetch(base.gear.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  return response.json();
}

export async function invalidRequest(method: string, params: any) {
  const response = await fetch(base.gear.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
    }),
  });
  return response.json();
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
  return response.json();
}
