import { NODE_ADRESS_URL_PARAM } from "@/shared/config";

const isString = (value: unknown): value is string => typeof value === "string";

const isNodeAddressValid = (address: string) => {
  const nodeRegex = /(ws|wss):\/\/[\w-.]+/;

  return isString(address) && nodeRegex.test(address);
};

const getNodeAddressFromUrl = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const nodeAddress = searchParams.get(NODE_ADRESS_URL_PARAM);

  if (nodeAddress && isNodeAddressValid(nodeAddress)) return nodeAddress;
};

export { getNodeAddressFromUrl };
