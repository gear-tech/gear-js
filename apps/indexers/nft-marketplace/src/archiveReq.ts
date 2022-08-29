import fetch from 'node-fetch';
import { IBatchResponse } from './types/batch';

export async function archiveReq(url: string, query: string): Promise<IBatchResponse> {
  const body = JSON.stringify({ query });

  const response = await fetch(url, { method: 'POST', body, headers: { 'content-type': 'application/json' } });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const resJson: any = await response.json();

  if (resJson.errors) {
    throw new Error(await response.text());
  }

  return resJson;
}
