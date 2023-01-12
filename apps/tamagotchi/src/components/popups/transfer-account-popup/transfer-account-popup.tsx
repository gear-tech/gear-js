import { Modal } from '@gear-js/ui';
import { TransferAccountForm } from '../../forms/transfer-account-form';

export const TransferAccountPopup = ({ close }: { close: () => void }) => {
  return (
    <Modal heading="Transfer" close={close}>
      <div className="space-y-6">
        <p>
          Transfer Geary to another account.
          <b className="font-semibold block">It will change the ownership.</b>
        </p>
        <TransferAccountForm close={close} />
      </div>
    </Modal>
  );
};
