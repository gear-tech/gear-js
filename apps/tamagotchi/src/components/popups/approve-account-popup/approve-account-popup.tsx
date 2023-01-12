import { Modal } from '@gear-js/ui';
import { ApproveAccountForm } from 'components/forms/approve-account-form';

export const ApproveAccountPopup = ({ close }: { close: () => void }) => {
  return (
    <Modal heading="Approve" close={close}>
      <div className="space-y-6">
        <p>
          Approve another account to dispose Geary.
          <b className="font-semibold block">It will not change the ownership.</b>
        </p>
        <ApproveAccountForm close={close} />
      </div>
    </Modal>
  );
};
