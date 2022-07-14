import { Button } from '@gear-js/ui';
import { useState } from 'react';
import { MessageModal } from 'components';

function MessageAction() {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const openMessageModal = () => setIsMessageModalOpen(true);

  const closeModal = () => {
    setIsMessageModalOpen(false);
  };

  const onMessageSubmit = (text: string, onSuccess: () => void) => {
    console.log(text);
    onSuccess();
  };

  return (
    <>
      <Button text="Add Message" onClick={openMessageModal} />
      {isMessageModalOpen && <MessageModal heading="Message" close={closeModal} onSubmit={onMessageSubmit} />}
    </>
  );
}

export { MessageAction };
