import { GearCommonEventMessageEntry } from '@gear-js/api';
import { MessageEntryPoint } from '../enums';

export const getMsgEntry = (entry: GearCommonEventMessageEntry) =>
  entry.isInit ? MessageEntryPoint.INIT : entry.isHandle ? MessageEntryPoint.HANDLE : MessageEntryPoint.REPLY;
