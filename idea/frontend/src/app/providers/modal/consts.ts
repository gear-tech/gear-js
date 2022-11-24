import { NetworkModal } from 'widgets/networkModal';
import { AccountsModal } from 'widgets/accountsModal';
import { TransactionModal } from 'widgets/transactionModal';
import { UploadFileModal } from 'widgets/uploadFileModal';
import { UploadMetadataModal } from 'widgets/uploadMetadataModal';
import { MessageModal } from 'widgets/messageModal';

const MODALS = {
  network: NetworkModal,
  accounts: AccountsModal,
  metadata: UploadMetadataModal,
  uploadFile: UploadFileModal,
  transaction: TransactionModal,
  message: MessageModal,
};

export { MODALS };
