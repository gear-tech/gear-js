import type { SailsProgram } from 'sails-js';

import { isIdlV2Program, type ParsedProgram } from './program';

type ServiceMethodKey = 'functions' | 'queries';
type SailsV2Service = SailsProgram['services'][string];
type ServiceMethod = SailsV2Service[ServiceMethodKey][string];

type ServiceMethodEntry = {
  name: string;
  method: ServiceMethod;
  extendedFrom?: string;
};

const formatServiceMethodLabel = (name: string, extendedFrom?: string) =>
  extendedFrom ? `${name} (Extended from ${extendedFrom})` : name;

const collectV2ServiceMethodEntries = (
  service: SailsV2Service,
  key: ServiceMethodKey,
  result: Map<string, ServiceMethodEntry>,
) => {
  for (const [name, method] of Object.entries(service[key])) {
    if (!result.has(name)) {
      result.set(name, { name, method, extendedFrom: undefined });
    }
  }

  const mergeFromBase = (baseName: string, base: SailsV2Service) => {
    for (const [name, method] of Object.entries(base[key])) {
      if (!result.has(name)) {
        result.set(name, { name, method, extendedFrom: baseName });
      }
    }

    for (const [nestedName, nested] of Object.entries(base.extends ?? {})) {
      mergeFromBase(nestedName, nested);
    }
  };

  for (const [baseName, base] of Object.entries(service.extends ?? {})) {
    mergeFromBase(baseName, base);
  }
};

const collectServiceMethodEntries = (
  program: ParsedProgram,
  serviceName: string,
  key: ServiceMethodKey,
): ServiceMethodEntry[] => {
  const service = program?.services?.[serviceName];
  if (!service) return [];

  if (!isIdlV2Program(program)) {
    return Object.entries(service[key]).map(([name, method]) => ({
      name,
      method: method as ServiceMethod,
    }));
  }

  const result = new Map<string, ServiceMethodEntry>();

  collectV2ServiceMethodEntries(service as SailsV2Service, key, result);

  return [...result.values()];
};

const collectServiceMethods = (
  program: ParsedProgram,
  serviceName: string,
  key: ServiceMethodKey,
): Record<string, ServiceMethod> =>
  Object.fromEntries(collectServiceMethodEntries(program, serviceName, key).map(({ name, method }) => [name, method]));

const getServiceMethod = (
  program: ParsedProgram,
  serviceName: string,
  key: ServiceMethodKey,
  methodName: string,
): ServiceMethod | undefined => collectServiceMethods(program, serviceName, key)[methodName];

export type { ServiceMethodEntry, ServiceMethodKey };
export { collectServiceMethodEntries, collectServiceMethods, formatServiceMethodLabel, getServiceMethod };
