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

const getTruncatedText = (value: string, prefixLength = 6) => {
  if (value.length <= prefixLength) return value;

  return `${value.substring(0, prefixLength)}...${value.slice(-prefixLength)}`;
};

export { copyToClipboard, getTruncatedText };
