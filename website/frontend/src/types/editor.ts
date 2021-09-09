export enum EditorTypes {
  file = 'file',
  folder = 'folder',
}

export type NodeId = string | 'root';
export type PathItem = string | 'root';

export type FileType<Type extends object> = {
  id: string;
  name: string;
  type: EditorTypes;
} & Type;

export type EditorFileRaw = FileType<{
  type: EditorTypes.file;
  lang: Languages;
  value: string;
}>;

export type EditorFolderRaw = FileType<{
  type: EditorTypes.folder;
  children: Record<string, EditorItemRaw>;
}>;

export type EditorItemRaw = EditorFolderRaw | EditorFileRaw;
export type EditorFileRawRecord = Record<string, EditorFileRaw>;
export type EditorFolderRawRecord = Record<string, EditorFolderRaw>;
export type EditorItemRawRecord = EditorFileRawRecord | EditorFolderRawRecord;

export type EditorFile = FileType<
  EditorFileRaw & {
    parentId: NodeId;
    path: PathItem[];
  }
>;

export type EditorFolder = FileType<
  Omit<EditorFolderRaw, 'children'> & {
    parentId: NodeId;
    path: string[];
    children: Record<string, EditorItem>;
  }
>;

export type EditorItem = EditorFolder | EditorFile;
export type EditorFileRecord = Record<string, EditorFile>;
export type EditorFolderRecord = Record<string, EditorFolder>;
export type EditorItemRecord = Record<string, EditorItem>;

export enum Languages {
  Rust = 'rust',
  Toml = 'toml',
  Txt = 'txt',
}
