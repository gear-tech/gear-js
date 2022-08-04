import { Hex } from '@gear-js/api';
import { USER } from 'consts';
import { SetStateAction, useState } from 'react';

function useUsers() {
  const [producers, setProducers] = useState([] as Hex[]);
  const [distributors, setDistributors] = useState([] as Hex[]);
  const [retailers, setRetailers] = useState([] as Hex[]);

  const isAnyUser = producers.length > 0 || distributors.length > 0 || retailers.length > 0;

  const addUser = (setUsers: (callback: SetStateAction<Hex[]>) => void) => (user: Hex) =>
    setUsers((prevUsers) => [...prevUsers, user]);

  const removeUser = (setUsers: (callback: SetStateAction<Hex[]>) => void) => (id: number) =>
    setUsers((prevUsers) => prevUsers.filter((_user, index) => index !== id));

  const addDistrubutor = addUser(setDistributors);
  const addRetailer = addUser(setRetailers);
  const addProducer = addUser(setProducers);

  const removeDistrubutor = removeUser(setDistributors);
  const removeRetailer = removeUser(setRetailers);
  const removeProducer = removeUser(setProducers);

  const handleAddUser = (type: string, user: Hex) => {
    switch (type) {
      case USER.DISTRIBUTOR:
        return addDistrubutor(user);
      case USER.RETAILER:
        return addRetailer(user);
      default:
        return addProducer(user);
    }
  };

  return {
    list: { producers, retailers, distributors },
    action: { removeDistrubutor, removeRetailer, removeProducer, addUser: handleAddUser },
    isAnyUser,
  };
}

export { useUsers };
