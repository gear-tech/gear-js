export const sleep = (ms: number) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(true);
    }, ms),
  );
