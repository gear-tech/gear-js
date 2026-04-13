import type { Sails } from 'sails-js';
import { getFnNamePrefix, getServiceNamePrefix } from 'sails-js';
import type { Hex } from 'viem';

type SailsMessageRoute = {
  service?: string;
  kind: 'constructor' | 'function' | 'query';
  name: string;
};

const getSailsMethod = (sails: Sails, payload: Hex) => {
  const serviceName = getServiceNamePrefix(payload);
  const constructor = sails.ctors[serviceName];
  if (constructor) {
    return { constructor, hasMethod: false, constructorName: serviceName };
  }

  const functionName = getFnNamePrefix(payload);
  const service = sails.services[serviceName];
  const hasFunction = Boolean(service?.functions?.[functionName]);
  const hasQuery = Boolean(service?.queries?.[functionName]);
  const method = service?.functions?.[functionName] ?? service?.queries?.[functionName];
  const hasMethod = hasFunction || hasQuery;
  const kind: SailsMessageRoute['kind'] | undefined = hasFunction ? 'function' : hasQuery ? 'query' : undefined;
  return { serviceName, functionName, method, hasMethod, kind };
};

const getDecodedPayload = (payload: Hex, sails: Sails | undefined) => {
  if (!sails) return null;

  try {
    const sailsMethod = getSailsMethod(sails, payload);
    const { constructor, method, hasMethod } = sailsMethod;

    if (constructor && !hasMethod) return constructor.decodePayload(payload);
    if (hasMethod && method) return method.decodePayload(payload);

    throw new Error(`Unable to decode payload ${payload} with sails method ${JSON.stringify(sailsMethod)}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getMessageName = (payload: Hex, sails: Sails | undefined) => {
  if (!sails) return null;

  try {
    const { serviceName, functionName, constructor, hasMethod, constructorName } = getSailsMethod(sails, payload);

    if (constructor && !hasMethod) return constructorName;
    if (hasMethod) return `${serviceName}.${functionName}`;

    return null;
  } catch {
    return null;
  }
};

const getMessageRoute = (payload: Hex, sails: Sails | undefined): SailsMessageRoute | null => {
  if (!sails) return null;

  try {
    const { serviceName, functionName, constructor, hasMethod, kind, constructorName } = getSailsMethod(sails, payload);

    if (constructor) return { kind: 'constructor', name: constructorName };
    if (hasMethod && kind) return { service: serviceName, kind, name: functionName };

    return null;
  } catch {
    return null;
  }
};

export type { SailsMessageRoute };
export { getDecodedPayload, getMessageName, getMessageRoute };
