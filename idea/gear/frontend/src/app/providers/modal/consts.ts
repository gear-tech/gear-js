import { TransferBalanceModal } from '@/features/balance';
import { MessageModal } from '@/widgets/messageModal';
import { NetworkModal } from '@/widgets/networkModal';
import { TransactionModal } from '@/widgets/transactionModal';
import { UploadFileModal } from '@/widgets/uploadFileModal';
import { UploadMetadataModal } from '@/widgets/uploadMetadataModal';

const MODALS = {
  network: NetworkModal,
  metadata: UploadMetadataModal,
  uploadFile: UploadFileModal,
  transaction: TransactionModal,
  message: MessageModal,
  transfer: TransferBalanceModal,
};

export { MODALS };
