import io from 'socket.io-client';
import { GEAR_LOCAL_WS_URI, GEAR_MNEMONIC_KEY, GEAR_STORAGE_KEY, PROGRAM_UPLOAD_ERRRORS } from 'consts';
import { BalanceModel, UploadProgramModel } from 'types/program';
import { 
  fetchBlockAction, 
  fetchTotalIssuanceAction, 
  programUploadSuccessAction, 
  programUploadInBlockAction,
  programUploadFinalizedAction,
  programUploadProgramInitializedAction, 
  programUploadFailedAction} from 'store/actions/actions';

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
      transports: ['websocket'],
      query: { Authorization: `Bearer ${this.key || ""}` },
    });
    this.socket.on('message', (data: any) => {
      if (Object.prototype.hasOwnProperty.call(data, "result")) {
        if (Object.prototype.hasOwnProperty.call(data.result, "totalIssuance")) {
          dispatch(fetchTotalIssuanceAction(data.result))
        } else if (Object.prototype.hasOwnProperty.call(data.result, "hash")) {
          dispatch(fetchBlockAction(data.result))
        } else if (Object.prototype.hasOwnProperty.call(data.result, "status")) {
          if (data.result.status === 'InBlock') {
            dispatch(programUploadInBlockAction());
          } else if (data.result.status === 'Finalized') {
            dispatch(programUploadFinalizedAction());
          } else if (data.result.status === 'ProgramInitialized') {
            dispatch(programUploadProgramInitializedAction());
          } else if (data.result.status === 'Success') {
            window.location.pathname = "/uploaded-programs";
            dispatch(programUploadSuccessAction());
          }
        }
      } else if (Object.prototype.hasOwnProperty.call(data, "error")) {
        if (Object.prototype.hasOwnProperty.call(data.error, "message")) {
          const uploadErrors = Object.values(PROGRAM_UPLOAD_ERRRORS).map(value => value.toLowerCase());
          if (uploadErrors.includes(data.error.message.toLowerCase())) {
            dispatch(programUploadFailedAction(data.error.message));
          }
        }
      }
    })
  }

  private generateRandomId() {
    return Math.floor(Math.random() * 1000000000);
  }

  public uploadProgram(file: File, opts: UploadProgramModel) {
    const { gasLimit, value, initPayload } = opts;
    const filename = file.name;
    const generatedId = this.generateRandomId();
    const keyPairJson = localStorage.getItem(GEAR_MNEMONIC_KEY) || '';

    return this.socket.emit('message', {
      jsonrpc: "2.0",
      id: generatedId,
      method: "program.upload",
      params: {
        file,
        filename,
        gasLimit,
        value,
        initPayload,
        keyPairJson
      }
    });
  }

  public getTotalIssuance() {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: "2.0",
      id: generatedId,
      method: "system.totalIssuance",
    });
  }

  public subscribeNewBlocks() {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: "2.0",
      id: generatedId,
      method: "blocks.newBlocks",
    });
  }

  public transferBalance(balanceValue: BalanceModel) {
    const generatedId = this.generateRandomId();

    this.socket.emit('message', {
      jsonrpc: "2.0",
      id: generatedId,
      method: "balance.transfer",
      params: balanceValue
    })
  }
}