import type { HttpUrl, IVaraEthProvider, IVaraEthValidatorPoolProvider, WsUrl } from '../types/index.js';

export function isWsUrl(url: string): url is WsUrl {
  if (url.startsWith('wss://')) return true;
  if (url.startsWith('ws://')) return true;
  return false;
}

export function isHttpUrl(url: string): url is HttpUrl {
  if (url.startsWith('https://')) return true;
  if (url.startsWith('http://')) return true;
  return false;
}

export function isPoolProvider(
  provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
): provider is IVaraEthValidatorPoolProvider {
  if ('isPool' in provider && provider.isPool === true) {
    return true;
  }

  return false;
}
