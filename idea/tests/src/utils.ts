export function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 2000);
  });
}
