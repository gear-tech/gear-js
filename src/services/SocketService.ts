import io from 'socket.io-client';
import { emitEvents, onEvents, GEAR_LOCAL_WS_URI, GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY } from 'consts';
import { UploadProgramModel } from 'types/program';
import { BlockModel, TotalIssuanceModel } from 'types/block';
import { fetchBlockAction, fetchTotalIssuanceAction } from 'store/actions/actions';

export interface ISocketService {
  uploadProgram(file: File, opts: UploadProgramModel): void;
  getTotalIssuance(): void;
  subscribeNewBlocks(): void;
}

export class SocketService implements ISocketService {

  private readonly socket: any;

  private readonly key: string | null;
  
  constructor(dispatch: any) {
    this.key = localStorage.getItem(GEAR_STORAGE_KEY);
    this.socket = io(GEAR_LOCAL_WS_URI, {
      query: { Authorization: `Bearer ${this.key || ""}` },
    });
    this.socket.on(onEvents.totalIssuance, (data: TotalIssuanceModel) => {
      dispatch(fetchTotalIssuanceAction(data))
    });
    this.socket.on(onEvents.newBlock, (data: BlockModel) => {
      dispatch(fetchBlockAction(data))
    });
  }
  
  public uploadProgram(file: File, opts: UploadProgramModel) {
    const { gasLimit, value, initPayload } = opts;
    const filename = file.name;
    const mnemonic = localStorage.getItem(GEAR_MNEMONIC_KEY) || '';

    return this.socket.emit(emitEvents.uploadProgram, {
      file,
      filename,
      gasLimit,
      value,
      initPayload,
      mnemonic,
    });
  }

  public getTotalIssuance() {
    this.socket.emit(emitEvents.totalIssuance);
  }

  public subscribeNewBlocks() {
    this.socket.emit(emitEvents.subscribeNewBlocks);
  }
}