export const statuses = {
  rmq: false,
  database: false,
  gear: false,
};

export const changeStatus = (service: 'rmq' | 'database' | 'gear', status?: boolean) => {
  statuses[service] = status === undefined ? !statuses[service] : status;
};
