declare const _default: {
  kafka: {
    clientId: string;
    groupId: string;
    brokers: string[];
  };
  db: {
    port: number;
    user: string;
    password: string;
    name: string;
    host: string;
  };
  gear: {
    providerAddress: string;
    accountSeed: string;
    rootAccountSeed: string;
    accountBalance: string;
    balanceToTransfer: string;
  };
};
export default _default;
