declare const _default: () => {
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    name: string;
  };
  kafka: {
    clientId: string;
    groupId: string;
    brokers: string[];
  };
};
export default _default;
