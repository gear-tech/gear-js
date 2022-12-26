import { Modal } from '@gear-js/ui';
import { ApproveAccountForm } from 'components/forms/approve-account-form';

type Props = {
  close: () => void;
};

export const ApproveAccountPopup = ({ close }: Props) => {
  return (
    <Modal heading="Transfer" close={close}>
      <div className="space-y-6">
        <p>
          Approve another account to dispose Geary.
          <b className="font-semibold block">It will not change the ownership.</b>
        </p>
        <ApproveAccountForm />
      </div>
    </Modal>
  );
};
