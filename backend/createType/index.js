const { ApiPromise, WsProvider } = require('@polkadot/api');
const { stringToU8a } = require('@polkadot/util');

exports.toBytes = async (wsProviderAddress, type, data) => {
  process.on('error');
  if (!type || !data) {
    return data;
  }
  let api;
  if (isJSON(type)) {
    type = toJSON(`{"Custom": ${type}}`);
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
      throwOnUnknown: false,
      throwOnConnect: true,
      types: {
        ...type,
      },
    });
    return api.createType(
      'Bytes',
      Array.from(api.createType('Custom', toJSON(data)).toU8a()),
    );
  } else {
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
      throwOnUnknown: false,
      throwOnConnect: true,
    });
    if (['string', 'utf8', 'utf-8'].includes(type.toLowerCase())) {
      return api.createType('Bytes', Array.from(stringToU8a(data)));
    } else if (type.toLowerCase() === 'bytes') {
      return api.createType('Bytes', data);
    } else {
      return api.createType(
        'Bytes',
        Array.from(api.createType(type, data).toU8a()),
      );
    }
  }
};

exports.fromBytes = async (wsProviderAddress, type, data) => {
  if (!type || !data) {
    return data;
  }
  let api;
  if (isJSON(type)) {
    type = toJSON(`{"Custom": ${type}}`);
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
      throwOnUnknown: false,
      throwOnConnect: true,
      types: {
        ...type,
      },
    });
    return api.createType('Custom', data);
  } else {
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
      throwOnUnknown: false,
      throwOnConnect: true,
    });
    return api.createType(type, data);
  }
};

function isJSON(data) {
  try {
    JSON.parse(data);
  } catch (error) {
    try {
      JSON.stringify(data);
    } catch (error) {
      return false;
    }
    return true;
  }
  return true;
}

function toJSON(data) {
  try {
    return JSON.parse(data);
  } catch (error) {
    try {
      JSON.stringify(data);
    } catch (error) {
      return null;
    }
    return data;
  }
}
