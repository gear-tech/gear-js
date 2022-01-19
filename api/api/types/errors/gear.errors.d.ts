export declare class GearError extends Error {
  name: string;
}
export declare class CreateTypeError extends GearError {
  name: string;
  message: string;
  constructor(message?: string);
}
export declare class TransactionError extends GearError {
  name: string;
  constructor(message: string);
}
