import { clsx } from 'clsx';

const cx = clsx;

const copyToClipboard = ({
  onSuccess,
  onError,
  value,
}: {
  onSuccess: () => void;
  onError: () => void;
  value: string;
}) => {
  function unsecuredCopyToClipboard(text: string) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
      onError();
    }
    document.body.removeChild(textArea);
  }

  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard
      .writeText(value)
      .then(() => onSuccess())
      .catch(() => onError());
  } else {
    unsecuredCopyToClipboard(value);
  }
};

function isTelegramMiniApp() {
  const params = new URLSearchParams(window.location.hash.slice(1));

  return params.has('tgWebAppPlatform') && params.has('tgWebAppVersion');
}

const getTruncatedText = (value: string, prefixLength = 6) => {
  if (value.length <= prefixLength) return value;

  return `${value.substring(0, prefixLength)}...${value.slice(-prefixLength)}`;
};

export { cx, copyToClipboard, isTelegramMiniApp, getTruncatedText };
