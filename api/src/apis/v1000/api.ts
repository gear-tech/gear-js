import { GearApi } from '../../GearApi';
import { V1000Message } from './message';
import { V1000Program } from './program';

export class VaraApiV1000 extends GearApi {
  public declare program: V1000Program;
  public declare message: V1000Message;
}
