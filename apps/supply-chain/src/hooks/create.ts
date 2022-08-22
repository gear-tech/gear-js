import { Hex } from '@gear-js/api';
import { Dispatch, SetStateAction, useState } from 'react';
import { USER } from 'consts';

type SetUsers = Dispatch<SetStateAction<Hex[]>>;

function useUsers() {
  const [producers, setProducers] = useState<Hex[]>([]);
  const [distributors, setDistributors] = useState<Hex[]>([]);
  const [retailers, setRetailers] = useState<Hex[]>([]);

  const isAnyUser = producers.length > 0 || distributors.length > 0 || retailers.length > 0;

  const addUser = (setUsers: SetUsers) => (user: Hex) => setUsers((prevUsers) => [...prevUsers, user]);

  const removeUser = (setUsers: SetUsers) => (id: number) =>
    setUsers((prevUsers) => prevUsers.filter((_user, index) => index !== id));

  const addDistrubutor = addUser(setDistributors);
  const addRetailer = addUser(setRetailers);
  const addProducer = addUser(setProducers);

  const removeDistrubutor = removeUser(setDistributors);
  const removeRetailer = removeUser(setRetailers);
  const removeProducer = removeUser(setProducers);

  const getUserSubmit = (type: string, user: Hex) => {
    switch (type) {
      case USER.DISTRIBUTOR:
        return { isUserExists: distributors.includes(user), addUser: addDistrubutor };
      case USER.RETAILER:
        return { isUserExists: retailers.includes(user), addUser: addRetailer };
      default:
        return { isUserExists: producers.includes(user), addUser: addProducer };
    }
  };

  return {
    list: { producers, retailers, distributors },
    action: { removeDistrubutor, removeRetailer, removeProducer, getUserSubmit },
    isAnyUser,
  };
}

export { useUsers };
