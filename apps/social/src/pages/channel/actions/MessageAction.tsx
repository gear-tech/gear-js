import { Button } from '@gear-js/ui';
import { useState } from 'react';
import { useChannelActions } from 'hooks';
import { MessageModal } from 'components';

function MessageAction() {
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const openMessageModal = () => setIsMessageModalOpen(true);
  const { post } = useChannelActions();

  const closeModal = () => {
    setIsMessageModalOpen(false);
  };

  const onMessageSubmit = (text: string) => {
    post(text, closeModal);
  };

  return (
    <>
      <Button text="Add Message" onClick={openMessageModal} />
      {isMessageModalOpen && <MessageModal heading="Message" close={closeModal} onSubmit={onMessageSubmit} />}
    </>
  );
}

export { MessageAction };
