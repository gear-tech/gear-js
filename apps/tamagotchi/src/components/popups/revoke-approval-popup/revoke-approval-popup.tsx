import { Button, Modal } from '@gear-js/ui';
import { useTamagocthiMessage } from 'app/hooks/use-tamagotchi-message';
import { useUpdateState } from 'app/hooks/use-update-state';

export const RevokeApprovalPopup = ({ close }: { close: () => void }) => {
  const sendHandler = useTamagocthiMessage();
  const { update } = useUpdateState();
  const onSuccess = () => {
    update();
    close();
  };
  const handler = () => sendHandler({ RevokeApproval: null }, { onSuccess });

  return (
    <Modal heading="Revoke approval" close={close}>
      <div className="flex gap-6">
        <Button text="Dismiss" color="secondary" onClick={close} />
        <Button text="Ok" color="primary" onClick={handler} />
      </div>
    </Modal>
  );
};
