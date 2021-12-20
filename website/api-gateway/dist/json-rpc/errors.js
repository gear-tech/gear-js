'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UnathorizedError =
  exports.InternalServerError =
  exports.MethodNotFoundError =
  exports.InvalidParamsError =
    void 0;
class GearError {
  constructor(message) {
    this.code = -32000;
    this.message = 'Gear Error';
    if (message) {
      this.message = `${this.message}. ${message}`;
    }
  }
  toJson() {
    return {
      code: this.code,
      message: this.message,
    };
  }
  getStatus() {
    return this.code;
  }
}
class InvalidParamsError extends GearError {
  constructor(message) {
    super();
    this.code = -32602;
    this.message = 'Invalid method parameters';
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
exports.InvalidParamsError = InvalidParamsError;
class MethodNotFoundError extends GearError {
  constructor() {
    super(...arguments);
    this.code = -32601;
    this.message = 'Method not found';
  }
}
exports.MethodNotFoundError = MethodNotFoundError;
class InternalServerError extends GearError {
  constructor() {
    super(...arguments);
    this.code = -32500;
    this.message = 'Internal server error';
  }
}
exports.InternalServerError = InternalServerError;
class UnathorizedError extends GearError {
  constructor() {
    super(...arguments);
    this.code = -32401;
    this.message = 'Unathorized';
  }
}
exports.UnathorizedError = UnathorizedError;
//# sourceMappingURL=errors.js.map
