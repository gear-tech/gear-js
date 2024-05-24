import base from './config';

export async function baseRequest(body: any) {
  const response = await fetch(base.gear.api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
}

export async function jsonrpcRequest(method: string, params: any) {
  const body = { jsonrpc: '2.0', id: Math.floor(Math.random() * 100) + 1, method, params };

  return baseRequest(body);
}

export function batchRequest(body: { method: string; params: any }[]) {
  return baseRequest(
    body.map((item) => ({
      jsonrpc: '2.0',
      id: Math.floor(Math.random() * 100),
      method: item.method,
      params: item.params,
    })),
  );
}
