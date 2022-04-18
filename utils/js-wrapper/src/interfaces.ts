export interface IArg {
  [name: string]: string;
}

export interface IFunction {
  name: string;
  args: IArg[];
  resultType: string;
}

export type Target = 'web' | 'nodejs' | 'bundler';

export type Paths = { pkgPath: string; declarationPath?: string; modPath: string; name: string };
