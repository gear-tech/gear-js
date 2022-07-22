import { Metadata } from '@gear-js/api';

export type UploadData = {
  meta: Metadata;
  metaFile: File;
  metaBuffer: string;
};
