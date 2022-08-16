import { CodeModel } from 'types/code';

export const getRowKey = (code: CodeModel, index: number) => `${code.id} ${index}`;
