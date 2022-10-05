const isNumeric = (value: string) => {
  const digitsRegex = /^\d+$/;

  return digitsRegex.test(value);
};

export { isNumeric };
