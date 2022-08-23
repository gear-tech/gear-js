import { ACTION, USER } from 'consts';
import { useState } from 'react';
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

  return ({ itemId }: ItemIdValue, onSuccess: () => void) => sendMessage({ [`ShipBy${role}`]: itemId }, { onSuccess });
}

function usePurchase(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: PurchaseValues, onSuccess: () => void) =>
    sendMessage({ [`PurchaseBy${role}`]: values }, { onSuccess });
}

function useReceive(role: string) {
  const sendMessage = useSupplyChainMessage();

  return ({ itemId }: ItemIdValue, onSuccess: () => void) =>
    sendMessage({ [`ReceiveBy${role}`]: itemId }, { onSuccess });
}

function useProducerActions() {
  const sendMessage = useSupplyChainMessage();

  const sale = useSale(USER.PRODUCER);
  const approve = useApprove(USER.PRODUCER);
  const ship = useShip(USER.PRODUCER);

  const produce = (tokenMetadata: ProduceValues, onSuccess: () => void) =>
    sendMessage({ Produce: { tokenMetadata } }, { onSuccess });

  return { produce, sale, approve, ship };
}

function useDistributorActions() {
  const sendMessage = useSupplyChainMessage();

  const purchase = usePurchase(USER.DISTRIBUTOR);
  const sale = useSale(USER.DISTRIBUTOR);
  const approve = useApprove(USER.DISTRIBUTOR);
  const ship = useShip(USER.DISTRIBUTOR);
  const receive = useReceive(USER.DISTRIBUTOR);

  const process = ({ itemId }: ItemIdValue, onSuccess: () => void) =>
    sendMessage({ ProcessByDistributor: itemId }, { onSuccess });
  const pack = ({ itemId }: ItemIdValue, onSuccess: () => void) =>
    sendMessage({ PackageByDistributor: itemId }, { onSuccess });

  return { purchase, process, pack, sale, approve, ship, receive };
}

function useRetailerActions() {
  const purchase = usePurchase(USER.RETAILER);
  const sale = useSale(USER.RETAILER);
  const receive = useReceive(USER.RETAILER);

  return { purchase, receive, sale };
}

function useConsumerActions() {
  const sendMessage = useSupplyChainMessage();

  const purchase = ({ itemId }: ItemIdValue) => sendMessage({ PurchaseByConsumer: itemId });

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
  const [itemId, setItemId] = useState('');
  const actions = useSupplyChainActions();

  const resetItem = () => setItemId('');

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
        return userActions.sale;
      case ACTION.APPROVE:
        return userActions.approve;
      case ACTION.SHIP:
        return userActions.ship;
      case ACTION.PURCHASE:
        return userActions.purchase;
      case ACTION.RECEIVE:
        return userActions.receive;
      case ACTION.PROCESS:
        return userActions.process;
      case ACTION.PACKAGE:
        return userActions.pack;
      default:
        return (values: ItemIdValue) => setItemId(values.itemId);
    }
  };

  return { handleSubmit: getSubmit(), itemId, resetItem };
}

export { useSubmit };
