export const statuses = {
  rmq: false,
  database: false,
  gear: false,
};

export const changeStatus = (service: 'rmq' | 'database' | 'gear') => {
  statuses[service] = !statuses[service];
};
