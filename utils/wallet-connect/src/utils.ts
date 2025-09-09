import { AlertContainerFactory } from '@gear-js/react-hooks';

const copyToClipboard = ({ alert, value }: { alert: AlertContainerFactory; value: string }) => {
  const onSuccess = () => alert.success('Copied');
  const onError = () => alert.error('Copy error');

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

export { copyToClipboard, isTelegramMiniApp };
