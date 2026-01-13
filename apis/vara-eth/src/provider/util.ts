import type { HttpUrl, IVaraEthProvider, IVaraEthValidatorPoolProvider, WsUrl } from '../types/index.js';

export function isWsUrl(url: string): url is WsUrl {
  return url.startsWith('wss://') || url.startsWith('ws://');
}

export function isHttpUrl(url: string): url is HttpUrl {
  return url.startsWith('https://') || url.startsWith('http://');
}

export function isPoolProvider(
  provider: IVaraEthProvider | IVaraEthValidatorPoolProvider,
): provider is IVaraEthValidatorPoolProvider {
  return 'isPool' in provider && provider.isPool === true;
}
