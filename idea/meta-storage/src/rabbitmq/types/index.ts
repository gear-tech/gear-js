interface IRMQMessage {
  service: null | string;
  action: null | string;
  genesis: string;
  params: any;
}

export { IRMQMessage };
