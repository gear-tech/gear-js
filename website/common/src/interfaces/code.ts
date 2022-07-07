enum CODE_STATUS {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

interface ICode {
  id: string;
  name: string;
  status: CODE_STATUS;
  expiration?: number | null;
}

interface ICodeChangedData {
  id: string;
  change: string;
  expiration?: number | null;
}

export { ICode, CODE_STATUS, ICodeChangedData };
