import { formatBalance as polkadotFormatBalance } from '@polkadot/util';

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

const formatDate = (rawDate: string | number) => {
  const date = new Date(rawDate);
  const time = date.toLocaleTimeString('en-GB');
  const formatedDate = date.toLocaleDateString('en-US').replace(/\//g, '-');

  return `${formatedDate} ${time}`;
};

const isString = (value: unknown): value is string => typeof value === 'string';
const getPreformattedText = (data: unknown) => JSON.stringify(data, null, 4);

export { copyToClipboard, formatBalance, formatNumber, formatDate, isString, getPreformattedText };
