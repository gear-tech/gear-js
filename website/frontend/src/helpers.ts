export const fileNameHandler = (filename: string) => {
  let transformedFileName = filename;
  if (transformedFileName.length > 24) {
    transformedFileName = `${transformedFileName.slice(0, 18)}...${transformedFileName.split('.').pop()}`;
  }
  return transformedFileName;
};

export const formatDate = (rawDate: string) => {
  const date = new Date(rawDate);
  const time = date.toLocaleTimeString('en-GB');
  const formatedDate = date.toLocaleDateString('en-US').replaceAll('/', '-');
  return `${formatedDate} ${time}`;
};

export const generateRandomId = () => Math.floor(Math.random() * 1000000000);

export function readFileAsync(file: File){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
};

export const toShortAddress = (_address: string) => {
  const address = (_address || '').toString();

  return (address.length > 13)
    ? `${address.slice(0, 6)}…${address.slice(-6)}`
    : address;
}
