import { GearApi } from '../../GearApi';
import { VaraMessage } from './message';
import { VaraProgram } from './program';

export class VaraApi extends GearApi {
  public declare program: VaraProgram;
  public declare message: VaraMessage;
}
