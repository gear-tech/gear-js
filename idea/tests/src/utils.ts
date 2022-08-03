export function sleep(time?: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, time ? time : 2000);
  });
}
