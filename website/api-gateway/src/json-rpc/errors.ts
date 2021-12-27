class GearError {
  code = -32000;
  message = 'Gear Error';

  constructor(message?) {
    if (message) {
      this.message = `${this.message}. ${message}`;
    }
  }

  public toJson() {
    return {
      code: this.code,
      message: this.message,
    };
  }

  public getStatus() {
    return this.code;
  }
}

export class InvalidParamsError extends GearError {
  code = -32602;
  message = 'Invalid method parameters';
  constructor(message?: string) {
    super();
    if (message) {
      if (message.includes('failed on gas_limit')) {
        const index = message.indexOf('failed on gas_limit');
        this.message = `${this.message}. F${message.slice(index + 1)}`;
      } else {
        this.message = `${this.message}. ${message}`;
      }
    }
  }
}

export class MethodNotFoundError extends GearError {
  code = -32601;
  message = 'Method not found';
}

export class InternalServerError extends GearError {
  code = -32500;
  message = 'Internal server error';
}

export class UnathorizedError extends GearError {
  code = -32401;
  message = 'Unathorized';
}
