import { createParser } from 'nuqs';

const isISOString = (value: string) => {
  const date = new Date(value);

  return !isNaN(date.getTime()) && date.toISOString() === value;
};

const parseAsIsoString = createParser({
  parse: (value) => (isISOString(value) ? value : null),
  serialize: (value) => value,
});

export { parseAsIsoString };
