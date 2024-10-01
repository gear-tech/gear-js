import express, { Express } from 'express';
import { JsonRpc, JsonRpcBase, JsonRpcMethod } from './decorators/method';
import { AllInOneService } from './services/all-in-one';
import {
  ParamGetCode,
  ParamGetCodes,
  ParamGetEvent,
  ParamGetEvents,
  ParamGetMsgsFromProgram,
  ParamGetMsgsToProgram,
  ParamGetProgram,
  ParamGetPrograms,
  ParamGetVoucher,
  ParamGetVouchers,
  ParamMsgFromProgram,
  ParamMsgToProgram,
  ParamSetProgramMeta,
} from './types';
import { Cache } from './middlewares/caching';
import { redisConnect } from './middlewares/redis';
import { Retry } from './middlewares/retry';
import { VoucherNotFound } from './errors';

export class JsonRpcServer extends JsonRpc(JsonRpcBase) {
  private _app: Express;

  constructor(private _services: Map<string, AllInOneService>) {
    super();
    this._app = express();
    this._app.use(express.json());
    this.setGenesises(Array.from(this._services.keys()));
    this._app.post('/api', async (req, res) => {
      const result = await this.handleRequest(req.body);
      res.json(result);
    });

    this._app.get('/api/voucher/:id', async (req, res) => {
      const { genesis } = req.query;
      if (!genesis) {
        res.status(400).json({ error: 'Genesis not found in the request' });
        return;
      }

      const voucherService = this._services.get(genesis.toString())?.voucher;
      if (!voucherService) {
        res.status(400).json({ error: 'Network is not supported' });
        return;
      }

      try {
        const voucher = await voucherService.getVoucher({ id: req.params.id, genesis: genesis.toString() });
        res.json(voucher);
      } catch (error) {
        if (error instanceof VoucherNotFound) {
          res.json(null);
          return;
        }
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    this._app.post('/api/vouchers', async (req, res) => {
      const { genesis } = req.query;
      if (!genesis) {
        res.status(400).json({ error: 'Genesis not found in the request' });
        return;
      }

      const voucherService = this._services.get(genesis.toString())?.voucher;
      if (!voucherService) {
        res.status(400).json({ error: 'Network is not supported' });
        return;
      }

      try {
        const vouchers = await voucherService.getVouchers(req.body);
        res.json(vouchers);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  public async run() {
    await redisConnect();
    this._app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  }

  @JsonRpcMethod('code.all')
  @Cache(15)
  async codeAll(params: ParamGetCodes) {
    return this._services.get(params.genesis).code.getCodes(params);
  }

  @JsonRpcMethod('code.data')
  @Cache(300)
  async codeData(params: ParamGetCode) {
    return this._services.get(params.genesis).code.getCode(params);
  }

  @JsonRpcMethod('code.setMeta')
  @Retry(20, 'Code meta is being set')
  async codeSetMeta(params: ParamGetCode) {
    return this._services.get(params.genesis).code.setMeta(params);
  }

  @JsonRpcMethod('program.all')
  @Cache(15)
  async programAll(params: ParamGetPrograms) {
    return this._services.get(params.genesis).program.getPrograms(params);
  }

  @JsonRpcMethod('program.data')
  @Cache(300)
  async programData(params: ParamGetProgram) {
    return this._services.get(params.genesis).program.getProgram(params);
  }

  @JsonRpcMethod('program.setMeta')
  @Retry(20, 'Program meta is being set')
  async programSetMeta(params: ParamSetProgramMeta) {
    return this._services.get(params.genesis).program.setMeta(params);
  }

  @JsonRpcMethod('messageFromProgram.all')
  @Cache(60)
  async messageFromProgramAll(params: ParamGetMsgsFromProgram) {
    return this._services.get(params.genesis).message.getMsgsFrom(params);
  }

  @JsonRpcMethod('messageFromProgram.data')
  @Cache(300)
  async messageFromProgramData(params: ParamMsgFromProgram) {
    return this._services.get(params.genesis).message.getMsgFrom(params);
  }

  @JsonRpcMethod('messageToProgram.all')
  @Cache(60)
  async messageToProgramAll(params: ParamGetMsgsToProgram) {
    return this._services.get(params.genesis).message.getMsgsTo(params);
  }

  @JsonRpcMethod('messageToProgram.data')
  @Cache(300)
  async messageToProgramData(params: ParamMsgToProgram) {
    return this._services.get(params.genesis).message.getMsgTo(params);
  }

  @JsonRpcMethod('event.all')
  @Cache(60)
  async eventAll(params: ParamGetEvents) {
    return this._services.get(params.genesis).event.getEvents(params);
  }

  @JsonRpcMethod('event.data')
  @Cache(300)
  async eventData(params: ParamGetEvent) {
    return this._services.get(params.genesis).event.getEvent(params);
  }

  @JsonRpcMethod('voucher.all')
  @Cache(15)
  async voucherAll(params: ParamGetVouchers) {
    return this._services.get(params.genesis).voucher.getVouchers(params);
  }

  @JsonRpcMethod('voucher.data')
  @Cache(15)
  async voucherData(params: ParamGetVoucher) {
    return this._services.get(params.genesis).voucher.getVoucher(params);
  }
}
