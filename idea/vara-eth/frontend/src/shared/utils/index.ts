import { formatBalance as polkadotFormatBalance } from '@polkadot/util';

export { clsx as cx } from 'clsx';

export { fetchWithGuard } from './fetch-with-guard';
export { isUndefined, isString } from './is';

const noop = () => {};

const copyToClipboard = ({
  value,
  onSuccess,
  onError,
}: {
  value: string;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  function unsecuredCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      onSuccess?.();
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
      onError?.();
    }
    document.body.removeChild(textArea);
  }

  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard
      .writeText(value)
      .then(() => onSuccess?.())
      .catch(() => onError?.());
  } else {
    unsecuredCopyToClipboard(value);
  }
};

function formatNumber(num: number, displayedDecimals: number = 0): string {
  const [integerPart, decimalPart] = num.toFixed(displayedDecimals).split('.');
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return displayedDecimals > 0 ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
}

const formatBalance = (value: bigint, decimals: number) => {
  return polkadotFormatBalance(value, { decimals, forceUnit: '-', withSi: false, withUnit: false });
};

const formatDate = (value: string | number) => new Date(value).toLocaleString();

const getPreformattedText = (data: unknown) => JSON.stringify(data, null, 4);

const getTruncatedText = (value: string, prefixLength = 8): string => {
  if (value.length <= (prefixLength + 2) * 2) return value;
  return `${value.slice(0, prefixLength + 2)}...${value.slice(-prefixLength)}`;
};

const isAnyKey = (value: Record<string, unknown>) => Object.keys(value).length > 0;

export {
  noop,
  copyToClipboard,
  formatBalance,
  formatNumber,
  formatDate,
  getPreformattedText,
  getTruncatedText,
  isAnyKey,
};
