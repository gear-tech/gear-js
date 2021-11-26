export const fileNameHandler = (filename: string) => {
  const transformedFileName = filename;

  return transformedFileName.length > 24
    ? `${transformedFileName.slice(0, 12)}…${transformedFileName.slice(-12)}`
    : transformedFileName;
};

export const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  const time = date.toLocaleTimeString('en-GB');
  const formatedDate = date.toLocaleDateString('en-US').replaceAll('/', '-');
  return `${formatedDate} ${time}`;
};

export const generateRandomId = () => Math.floor(Math.random() * 1000000000);

export function readFileAsync(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}

export const toShortAddress = (_address: string) => {
  const address = (_address || '').toString();

  return address.length > 13 ? `${address.slice(0, 6)}…${address.slice(-6)}` : address;
};

export const copyToClipboard = (key: string, alert: any, successfulText?: string) => {
  try {
    navigator.clipboard.writeText(key);
    alert.success(successfulText || 'Copied');
  } catch (err) {
    alert.error('Copy error');
  }
};

export const signPayload = async (injector: any, address: string, payload: any, callback: any) => {
  try {
    const { signature } = await injector.signer.signRaw!({
      address,
      data: payload,
      type: 'payload',
    });

    callback(signature);
  } catch (err) {
    console.error(err);
  }
};
