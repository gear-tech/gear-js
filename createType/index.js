const { ApiPromise, WsProvider } = require('@polkadot/api');
const { isString, stringToU8a } = require('@polkadot/util');

exports.toBytes = async (wsProviderAddress, type, data) => {
  let api;
  if (!type || !data) {
    return data;
  }
  if (isJSON(type)) {
    type = JSON.parse(`{"Custom": ${type}}`);
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
      types: {
        ...type,
      },
    });
    result = api.createType(
      'Bytes',
      Array.from(api.createType('Custom', JSON.parse(data)).toU8a()),
    );
    return result;
  } else {
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
    });
    if (['string', 'utf8', 'utf-8'].includes(type.toLowerCase())) {
      result = api.createType('Bytes', Array.from(stringToU8a(data)));
    } else if (type.toLowerCase() === 'bytes') {
      result = api.createType('Bytes', data);
    } else {
      result = api.createType(
        'Bytes',
        Array.from(api.createType(type, data).toU8a()),
      );
    }
    return result;
  }
};

exports.fromBytes = async (wsProviderAddress, type, data) => {
  let types = null;
  let api;
  let result = null;
  try {
    types = JSON.parse(`{"Custom": ${type}}`);
  } catch (error) {}
  if (types) {
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
      types: {
        ...types,
      },
    });
    result = api.createType('Custom', data);
  } else {
    api = await ApiPromise.create({
      provider: new WsProvider(wsProviderAddress),
    });
    result = api.createType(type, data);
  }
  return result;
};

function isJSON(data) {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
}
