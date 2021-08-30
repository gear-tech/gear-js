export type EditorFile = {
  name: string;
  lang: Languages;
  value: string;
  folder?: string;
};

export enum Languages {
  Rust = 'rust',
  Toml = 'toml',
}
