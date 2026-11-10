// Kept only to recognize saved selections and RPC aliases of the retired Substrate network.
const RETIRED_VARA_TESTNET_GENESIS = '0x525639f713f397dcf839bd022cd821f367ebcf179de7b9253531f8adbe5436d6';
const MAINNET_ENDPOINT = 'wss://rpc.vara.network';
const LOCAL_ENDPOINT = 'ws://127.0.0.1:9944';
const RETIRED_NETWORK_MESSAGE =
  'Vara Substrate testnet has been retired. Select a supported network to continue. Use a local node for test transactions.';

function isRetiredVaraTestnet(value: string) {
  let decoded = value;
  try {
    decoded = decodeURIComponent(decodeURIComponent(value));
  } catch {
    // Match the original value if it is not a URI-encoded string.
  }

  return /testnet\.vara(?:-network\.io|\.network)(?=[:/\s?#]|$)|vara[\s_-]*testnet|testnet[\s_-]*vara/i.test(decoded);
}

function resolveInitialNetwork({
  urlNode,
  savedNode,
  savedGenesis,
  defaultEndpoint,
}: {
  urlNode?: string;
  savedNode: string | null;
  savedGenesis: string | null;
  defaultEndpoint: string;
}) {
  const endpoint = urlNode || savedNode || defaultEndpoint;
  const requiresSelection =
    isRetiredVaraTestnet(endpoint) || (!urlNode && savedGenesis === RETIRED_VARA_TESTNET_GENESIS);

  return { endpoint, requiresSelection };
}

export {
  isRetiredVaraTestnet,
  LOCAL_ENDPOINT,
  MAINNET_ENDPOINT,
  RETIRED_NETWORK_MESSAGE,
  RETIRED_VARA_TESTNET_GENESIS,
  resolveInitialNetwork,
};
