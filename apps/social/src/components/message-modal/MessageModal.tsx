import { Button, Textarea, Modal } from '@gear-js/ui';
import { ChangeEvent, FormEvent, useState } from 'react';

import styles from './MessageModal.module.scss';

type Props = {
  heading: string;
  close: () => void;
  onSubmit: (value: string, onSuccess: () => void) => void;
};

function MessageModal({ heading, close, onSubmit }: Props) {
  const [message, setMessage] = useState('');
  const handleMessageChange = ({ target: { value } }: ChangeEvent<HTMLTextAreaElement>) => setMessage(value);

  const trimmedMessage = message.trim();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trimmedMessage) onSubmit(trimmedMessage, close);
  };

  return (
    <Modal heading={heading} close={close}>
      <form onSubmit={handleSubmit}>
        <Textarea className={styles.textarea} value={message} onChange={handleMessageChange} />
        <Button type="submit" text="Sent message" block disabled={!trimmedMessage} />
      </form>
    </Modal>
  );
}

export { MessageModal };
