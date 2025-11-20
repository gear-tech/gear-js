import { clsx } from 'clsx';

const cx = clsx;

const copyToClipboard = ({
  onSuccess,
  onError,
  value,
}: {
  onSuccess: () => void;
  onError: (error: Error) => void;
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
      onError(err as Error);
    }
    document.body.removeChild(textArea);
  }

  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard
      .writeText(value)
      .then(() => onSuccess())
      .catch((error: Error) => onError(error));
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
