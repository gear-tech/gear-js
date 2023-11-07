import { NetworkModal } from '@/widgets/networkModal';
import { TransactionModal } from '@/widgets/transactionModal';
import { UploadFileModal } from '@/widgets/uploadFileModal';
import { UploadMetadataModal } from '@/widgets/uploadMetadataModal';
import { MessageModal } from '@/widgets/messageModal';

const MODALS = {
  network: NetworkModal,
  metadata: UploadMetadataModal,
  uploadFile: UploadFileModal,
  transaction: TransactionModal,
  message: MessageModal,
};

export { MODALS };
