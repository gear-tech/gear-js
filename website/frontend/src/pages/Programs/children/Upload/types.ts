export enum UploadTypes {
  PROGRAM = 'program',
  CODE = 'code',
}

export type DroppedFile = {
  file: File;
  type: UploadTypes;
};
