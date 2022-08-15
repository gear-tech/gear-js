import { USER } from 'consts';
import { useSupplyChainMessage } from './api';

type ProduceValues = { name: string; description: string };
type SaleValues = { itemId: string; price: string };
type ApproveValues = { itemId: string; approve: boolean };
type ItemIdValue = { itemId: string };
type PurchaseValues = { itemId: string; deliveryTime: string };

function useSale(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: SaleValues) => sendMessage({ [`PutUpForSaleBy${role}`]: values });
}

function useApprove(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: ApproveValues) => sendMessage({ [`ApproveBy${role}`]: values });
}

function useShip(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: ItemIdValue) => sendMessage({ [`ShipBy${role}`]: values });
}

function usePurchase(role: string) {
  const sendMessage = useSupplyChainMessage();

  return (values: PurchaseValues) => sendMessage({ [`PurchaseBy${role}`]: values });
}

function useProducerActions() {
  const sendMessage = useSupplyChainMessage();

  const sale = useSale(USER.PRODUCER);
  const approve = useApprove(USER.PRODUCER);
  const ship = useShip(USER.PRODUCER);

  const produce = ({ name, description }: ProduceValues) => sendMessage({ Produce: { name, description } });

  return { produce, sale, approve, ship };
}

function useDistributorActions() {
  const sendMessage = useSupplyChainMessage();

  const purchase = usePurchase(USER.DISTRIBUTOR);
  const sale = useSale(USER.DISTRIBUTOR);
  const approve = useApprove(USER.DISTRIBUTOR);
  const ship = useShip(USER.DISTRIBUTOR);

  const process = ({ itemId }: ItemIdValue) => sendMessage({ ProcessByDistributor: itemId });
  const pack = ({ itemId }: ItemIdValue) => sendMessage({ PackageByDistributor: itemId });

  return { purchase, process, pack, sale, approve, ship };
}

function useRetailerActions() {
  const sendMessage = useSupplyChainMessage();

  const purchase = usePurchase(USER.RETAILER);
  const sale = useSale(USER.RETAILER);

  const recieve = ({ itemId }: ItemIdValue) => sendMessage({ RecieveByReatiler: itemId });

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

export { useSupplyChainActions };
