import {
  type Code,
  CodeStatus,
  MessageEntryPoint,
  type MessageFromProgram,
  MessageReadReason,
  type MessageToProgram,
  MetaType,
  type Program,
  ProgramStatus,
} from 'gear-idea-indexer-db';

const CODE_STATUS: Record<CodeStatus, string> = {
  [CodeStatus.Active]: 'Active',
  [CodeStatus.Inactive]: 'Inactive',
  [CodeStatus.Unknown]: 'Unknown',
};

const PROGRAM_STATUS: Record<ProgramStatus, string> = {
  [ProgramStatus.Unknown]: 'unknown',
  [ProgramStatus.ProgramSet]: 'programSet',
  [ProgramStatus.Active]: 'active',
  [ProgramStatus.Terminated]: 'terminated',
  [ProgramStatus.Exited]: 'exited',
  [ProgramStatus.Paused]: 'paused',
};
export const PROGRAM_STATUS_REVERSE: Record<string, ProgramStatus> = {
  unknown: ProgramStatus.Unknown,
  programSet: ProgramStatus.ProgramSet,
  active: ProgramStatus.Active,
  terminated: ProgramStatus.Terminated,
  exited: ProgramStatus.Exited,
  paused: ProgramStatus.Paused,
};

const ENTRY: Record<MessageEntryPoint, string> = {
  [MessageEntryPoint.Init]: 'init',
  [MessageEntryPoint.Handle]: 'handle',
  [MessageEntryPoint.Reply]: 'reply',
};
export const ENTRY_REVERSE: Record<string, MessageEntryPoint> = {
  init: MessageEntryPoint.Init,
  handle: MessageEntryPoint.Handle,
  reply: MessageEntryPoint.Reply,
};

const READ_REASON: Record<MessageReadReason, string> = {
  [MessageReadReason.OutOfRent]: 'OutOfRent',
  [MessageReadReason.Claimed]: 'Claimed',
  [MessageReadReason.Replied]: 'Replied',
};

const META_TYPE: Record<MetaType, string> = { [MetaType.Sails]: 'sails', [MetaType.Meta]: 'meta' };

const toStr = (map: Record<number, string>, v: unknown) => (v != null ? (map[v as number] ?? v) : v);

export const serializeCode = (c: Code) => ({
  ...c,
  status: toStr(CODE_STATUS, c.status),
  metaType: toStr(META_TYPE, c.metaType),
});

export const serializeProgram = (p: Program) => ({
  ...p,
  status: toStr(PROGRAM_STATUS, p.status),
  metaType: toStr(META_TYPE, p.metaType),
});

export const serializeMsgToProgram = (m: MessageToProgram) => ({
  ...m,
  entry: toStr(ENTRY, m.entry),
});

export const serializeMsgFromProgram = (m: MessageFromProgram) => ({
  ...m,
  readReason: toStr(READ_REASON, m.readReason),
});
