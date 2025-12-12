import { Sails } from 'sails-js';

const getValidSailsFilterValue = (
  sails: Sails | undefined,
  type: 'events' | 'functions',
  value: string,
  defaultValue: string,
) => {
  const serviceNames = Object.keys(sails?.services || {});
  const serviceNameValues = [defaultValue, ...serviceNames];

  const [serviceName, functionName = ''] = value.split('.');

  const functionNames = Object.keys(sails?.services?.[serviceName]?.[type] || {});
  const functionNameValues = [defaultValue, ...functionNames];

  return serviceNameValues.includes(serviceName) && functionNameValues.includes(functionName) ? value : defaultValue;
};

export { getValidSailsFilterValue };
