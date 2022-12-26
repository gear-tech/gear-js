const isExists = (value: string) => (!value ? 'Field is required' : null);

const isMinValue = (value: number, minDefaultValue: number) =>
  value < minDefaultValue ? `Minimal value ${minDefaultValue}` : null;

export { isExists, isMinValue };
