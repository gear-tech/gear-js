const { ApiPromise, WsProvider } = require('@polkadot/api');

exports.toBytes = async (wsProviderAddress, type, data) => {
  type = JSON.parse(`{"Custom": ${type}}`);
  const api = await ApiPromise.create({
    provider: new WsProvider(wsProviderAddress),
    types: {
      ...type,
    },
  });

  const result = api.createType(
    'Bytes',
    Array.from(api.createType('Custom', JSON.parse(data)).toU8a()),
  );
  return result;
};

exports.fromBytes = async (wsProviderAddress, type, data) => {
  type = JSON.parse(`{"Custom": ${type}}`);
  const api = await ApiPromise.create({
    provider: new WsProvider(wsProviderAddress),
    types: {
      ...type,
    },
  });

  const result = api.createType('Custom', data);
  return result;
};
