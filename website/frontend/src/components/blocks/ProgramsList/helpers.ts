import { ProgramModel } from 'types/program';

export const getRowKey = (program: ProgramModel, index: number) => `${program.id} ${index}`;
