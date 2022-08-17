import { ACTION, USER } from 'consts';
import { useSupplyChainMessage } from './api';

type ProduceValues = { name: string; description: string };
type SaleValues = { itemId: string; price: string };
type ApproveValues = { itemId: string; approve: boolean };
type ItemIdValue = { itemId: string };
type PurchaseValues = { itemId: string; deliveryTime: string };

function useSale(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: SaleValues, onSuccess: () => void) =>
    sendMessage({ [`PutUpForSaleBy${role}`]: values }, { onSuccess });
}

function useApprove(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: ApproveValues, onSuccess: () => void) => sendMessage({ [`ApproveBy${role}`]: values }, { onSuccess });
}

function useShip(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: ItemIdValue, onSuccess: () => void) => sendMessage({ [`ShipBy${role}`]: values }, { onSuccess });
}

function usePurchase(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: PurchaseValues, onSuccess: () => void) =>
    sendMessage({ [`PurchaseBy${role}`]: values }, { onSuccess });
}

function useProducerActions() {
  const sendMessage = useSupplyChainMessage();

  const sale = useSale(USER.PRODUCER);
  const approve = useApprove(USER.PRODUCER);
  const ship = useShip(USER.PRODUCER);

  const produce = (values: ProduceValues, onSuccess: () => void) => sendMessage({ Produce: values }, { onSuccess });

  return { produce, sale, approve, ship };
}

function useDistributorActions() {
  const sendMessage = useSupplyChainMessage();

  const purchase = usePurchase(USER.DISTRIBUTOR);
  const sale = useSale(USER.DISTRIBUTOR);
  const approve = useApprove(USER.DISTRIBUTOR);
  const ship = useShip(USER.DISTRIBUTOR);

  const process = ({ itemId }: ItemIdValue, onSuccess: () => void) =>
    sendMessage({ ProcessByDistributor: itemId }, { onSuccess });
  const pack = ({ itemId }: ItemIdValue, onSuccess: () => void) =>
    sendMessage({ PackageByDistributor: itemId }, { onSuccess });

  return { purchase, process, pack, sale, approve, ship };
}

function useRetailerActions() {
  const sendMessage = useSupplyChainMessage();

  const purchase = usePurchase(USER.RETAILER);
  const sale = useSale(USER.RETAILER);

  const recieve = ({ itemId }: ItemIdValue, onSuccess: () => void) =>
    sendMessage({ RecieveByReatiler: itemId }, { onSuccess });

  return { purchase, recieve, sale };
}

function useConsumerActions() {
  const purchase = usePurchase(USER.CONSUMER);

  return { purchase };
}

function useSupplyChainActions() {
  const producer = useProducerActions();
  const distributor = useDistributorActions();
  const retailer = useRetailerActions();
  const consumer = useConsumerActions();

  return { producer, distributor, retailer, consumer };
}

function useSubmit(role: string, action: string) {
  const actions = useSupplyChainActions();

  const getSubmit = () => {
    let userActions: { [key: string]: (value: any, onSuccess: () => void) => void };

    switch (role) {
      case USER.PRODUCER:
        userActions = actions.producer;
        break;
      case USER.DISTRIBUTOR:
        userActions = actions.distributor;
        break;
      case USER.RETAILER:
        userActions = actions.retailer;
        break;
      default:
        userActions = actions.consumer;
        break;
    }

    switch (action) {
      case ACTION.PRODUCE:
        return userActions.produce;
      case ACTION.SALE:
        return userActions.sell;
      case ACTION.APPROVE:
        return userActions.approve;
      case ACTION.SHIP:
        return userActions.ship;
      case ACTION.PURCHASE:
        return userActions.purchase;
      case ACTION.RECEIVE:
        return userActions.recieve;
      case ACTION.PROCESS:
        return userActions.process;
      case ACTION.PACKAGE:
        return userActions.pack;
      default:
        return () => {};
    }
  };

  return getSubmit();
}

export { useSubmit };
