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
  ParamMsgFromProgram,
  ParamMsgToProgram,
  ParamSetProgramMeta,
} from './types';
import { validateGenesisMiddleware } from './middlewares';
import { Cache } from './middlewares/caching';
import { redisConnect } from './middlewares/redis';
import { Retry } from './middlewares/retry';

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
  @Retry(100, 'Code meta is being set')
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
  @Retry(100, 'Program meta is being set')
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
}
