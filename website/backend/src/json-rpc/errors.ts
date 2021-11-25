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
        this.message = `${this.message}. F${message.slice(message.indexOf('failed on gas_limit') + 1)}`;
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

export class GearNodeError extends GearError {
  code = -32010;
  message = 'Gear node error';
  constructor(message?) {
    super();
    this.message = `${this.message}. ${message}`;
  }
}

export class TransactionError extends GearError {
  code = -32011;
  message = 'Invalid transaction';

  constructor(message?) {
    super();
    this.message = `${this.message}. ${message}`;
  }
}

export class NotFoundPath extends GearError {
  code = -32404;
  message = 'Not found. Use /api endpoint (Method POST) for requests';
}

export class ProgramNotFound extends GearError {
  code = -32013;
  message = 'Program not found';

  constructor(hash?) {
    super();
    if (hash) {
      this.message = `Program with hash ${hash} not found`;
    }
  }
}

export class MetadataNotFound extends GearError {
  code = -32015;
  message = 'Metadata not found';
}
export class MessageNotFound extends GearError {
  code = -32014;
  message = 'Message not found';
}

export class SignNotVerified extends GearError {
  code = -32017;
  message = 'Signature not verified';
}
