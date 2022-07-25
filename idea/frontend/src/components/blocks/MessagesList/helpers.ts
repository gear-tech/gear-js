import { MessageModel } from 'types/message';

export const getRowKey = (row: MessageModel, index: number) => `${row.id} ${index}`;
