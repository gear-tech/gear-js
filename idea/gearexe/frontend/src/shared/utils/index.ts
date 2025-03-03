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

function formatNumber(num: number, decimals: number = 0): string {
  const [integerPart, decimalPart] = num.toFixed(decimals).split('.');

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
}

const formatDate = (rawDate: string | number) => {
  const date = new Date(rawDate);
  const time = date.toLocaleTimeString('en-GB');
  const formatedDate = date.toLocaleDateString('en-US').replace(/\//g, '-');

  return `${formatedDate} ${time}`;
};

export { copyToClipboard, formatNumber, formatDate };
