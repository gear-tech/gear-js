declare class GearError {
  code: number;
  message: string;
  constructor(message?: any);
  toJson(): {
    code: number;
    message: string;
  };
  getStatus(): number;
}
export declare class InvalidParamsError extends GearError {
  code: number;
  message: string;
  constructor(message?: string);
}
export declare class MethodNotFoundError extends GearError {
  code: number;
  message: string;
}
export declare class InternalServerError extends GearError {
  code: number;
  message: string;
}
export declare class UnathorizedError extends GearError {
  code: number;
  message: string;
}
export {};
