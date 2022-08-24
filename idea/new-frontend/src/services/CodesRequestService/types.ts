import { CodeModel } from 'entities/code';

type CodePaginationModel = {
  count: number;
  listCode: CodeModel[];
};

export type { CodePaginationModel };
