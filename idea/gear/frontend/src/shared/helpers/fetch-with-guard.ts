import { STATUS_CODES } from 'node:http';

type Parameters = {
  url: string | URL;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  parameters?: object;
  isJson?: boolean;
};

type FetchWithGuard = {
  <T>(parameters: Parameters & { isJson?: true }): Promise<T>;
  (parameters: Parameters & { isJson?: false }): Promise<Response>;
};

const fetchWithGuard: FetchWithGuard = async <T>({
  url,
  method = 'GET',
  headers = {},
  parameters,
  isJson = true,
}: Parameters) => {
  const requestHeaders = { 'Content-Type': 'application/json;charset=utf-8', ...headers };
  const body = parameters ? JSON.stringify(parameters) : undefined;

  const response = await fetch(url, { headers: requestHeaders, method, body });

  if (!response.ok) {
    const result = (await response.json().catch(() => ({}))) as unknown;

    throw new Error(
      result !== null && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
        ? result.error
        : response.statusText || STATUS_CODES[response.status],
    );
  }

  return isJson ? (response.json() as T) : response;
};

export { fetchWithGuard };
