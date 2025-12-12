import { Sails } from 'sails-js';

const getParsedFilterValue = (value: string) => {
  const [group, item = ''] = value.split('.');

  return { group, item };
};

const getParsedSailsFilterValue = (value: string) => {
  const { group: serviceName, item: functionName } = getParsedFilterValue(value);

  return { serviceName, functionName };
};

const getValidSailsFilterValue = (
  sails: Sails | undefined,
  type: 'events' | 'functions',
  value: string,
  defaultValue: string,
) => {
  const serviceNames = Object.keys(sails?.services || {});
  const serviceNameValues = [defaultValue, ...serviceNames];

  const { serviceName, functionName } = getParsedSailsFilterValue(value);

  const functionNames = Object.keys(sails?.services?.[serviceName]?.[type] || {});
  const functionNameValues = [defaultValue, ...functionNames];

  return serviceNameValues.includes(serviceName) && functionNameValues.includes(functionName) ? value : defaultValue;
};

export { getParsedFilterValue, getParsedSailsFilterValue, getValidSailsFilterValue };
