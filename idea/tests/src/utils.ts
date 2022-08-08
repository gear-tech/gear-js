export function sleep(time = 2000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, time);
  });
}
