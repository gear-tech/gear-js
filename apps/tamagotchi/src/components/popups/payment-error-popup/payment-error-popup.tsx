import { Button, Modal } from '@gear-js/ui';
import { Icon } from '../../ui/icon';

type Props = {
  close: () => void;
};

export const PaymentErrorPopup = ({ close }: Props) => {
  return (
    <Modal heading="Payment error" close={close}>
      <div className="space-y-6">
        <p>
          There are not enough funds on your account, please replenish the balance using the "Get Token Balance" button
        </p>
        <Button
          className="gap-2 w-full"
          color="primary"
          text="Get Token Balance"
          icon={() => <Icon name="money" className="w-5 h-5" />}
        />
      </div>
    </Modal>
  );
};
