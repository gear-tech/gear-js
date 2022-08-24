import Identicon from '@polkadot/react-identicon';
import { Modal, Button } from '@gear-js/ui';

import { ModalProps } from 'entities/modal';
import { getShortName } from 'shared/helpers';

import styles from './TransactionModal.module.scss';

type Props = ModalProps & {
  fee: string;
  name: string;
  addressTo?: string;
  addressFrom: string;
  onAbort?: () => void;
  onConfirm: () => void;
};

const TransactionModal = (props: Props) => {
  const { fee, name, addressTo, addressFrom, onClose, onAbort, onConfirm } = props;

  const handleClose = () => {
    if (onAbort) {
      onAbort();
    }

    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal heading="Transaction details" className={styles.modalContent} close={handleClose}>
      <h4 className={styles.contentHeading}>
        Sending transaction <span className={styles.headingName}>{name}</span>
      </h4>
      <p className={styles.contentFeeInfo}>Fees of {fee} will be applied to the submission</p>
      <div className={styles.contentTransactionInfo}>
        <Identicon value={addressFrom} size={28} theme="polkadot" className={styles.infoIcon} />
        <p className={styles.infoParticipant}>
          <span className={styles.participantSide}>From:</span>
          <span className={styles.participantValue}>{getShortName(addressFrom)}</span>
        </p>
        {addressTo && (
          <p className={styles.infoParticipant}>
            <span className={styles.participantSide}>To:</span>
            <span className={styles.participantValue}>{getShortName(addressTo)}</span>
          </p>
        )}
      </div>
      <div className={styles.contentButtons}>
        <Button text="Submit" className={styles.actionButton} onClick={handleConfirm} />
        <Button text="Cancel" color="secondary" className={styles.actionButton} onClick={handleClose} />
      </div>
    </Modal>
  );
};

export { TransactionModal };
