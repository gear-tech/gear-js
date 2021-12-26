export interface CompilerState {
  isBuildDone: boolean;
}

export enum CompilerActionTypes {
  SET_IS_BUILD_DONE = 'SET_IS_BUILD_DONE',
}

interface SetIsBuildDone {
  type: CompilerActionTypes.SET_IS_BUILD_DONE;
  payload: boolean;
}

export type CompilerAction = SetIsBuildDone;
