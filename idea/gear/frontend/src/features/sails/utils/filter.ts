import type { ParsedSails } from '../types';

const getParsedFilterValue = (value: string) => {
  const [group, item = ''] = value.split('.');

  return { group, item };
};

const getParsedSailsFilterValue = (value: string) => {
  const { group: serviceName, item: functionName } = getParsedFilterValue(value);

  return { serviceName, functionName };
};

const getValidSailsFilterValue = (
  program: ParsedSails | undefined,
  type: 'events' | 'functions',
  value: string,
  defaultValue: string,
) => {
  const serviceNames = Object.keys(program?.services || {});
  const serviceNameValues = [defaultValue, ...serviceNames];

  const { serviceName, functionName } = getParsedSailsFilterValue(value);

  const functionNames = Object.keys(program?.services?.[serviceName]?.[type] || {});
  const functionNameValues = [defaultValue, ...functionNames];

  return serviceNameValues.includes(serviceName) && functionNameValues.includes(functionName) ? value : defaultValue;
};

export { getParsedFilterValue, getParsedSailsFilterValue, getValidSailsFilterValue };
