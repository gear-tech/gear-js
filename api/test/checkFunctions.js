const checkLog = (event, programId, messageId) => {
  if (event.data[0].source.toHex() === programId) {
    if (event.data[0].reply.unwrap()[1].toNumber() === 0 && event.data[0].reply.unwrap()[0].toHex() === messageId) {
      return true;
    }
  }
  return false;
};

const checkInit = async (api, programId) => {
  let resolveInit;
  const initPromise = new Promise((resolve) => {
    resolveInit = resolve;
  });
  const unsub = await api.gearEvents.subscribeToProgramEvents((event) => {
    if (event.data.info.programId.toHex() === programId) {
      if (api.events.gear.InitSuccess.is(event)) {
        resolveInit('success');
      } else {
        resolveInit('failed');
      }
    }
  });
  const result = await initPromise;
  unsub();
  return result;
};

const sendTransaction = async (submitted, account, methodName) => {
  let transactionResolve;
  const transactionPromise = new Promise((resolve) => {
    transactionResolve = resolve;
  });
  submitted.signAndSend(account, ({ events = [] }) => {
    events.forEach(({ event: { method, data } }) => {
      if (method === 'ExtrinsicFailed') {
        throw new Error(data.toString());
      } else if (method === methodName) {
        transactionResolve(data[0].toHuman());
      }
    });
  });
  return await transactionPromise;
};

module.exports = { checkInit, checkLog, sendTransaction };
