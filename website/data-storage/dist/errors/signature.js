'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.SignNotVerified = void 0;
const base_1 = require('./base');
class SignNotVerified extends base_1.GearError {
  constructor() {
    super(...arguments);
    this.name = 'SignatureNotVerified';
    this.message = 'Signature not verified';
  }
}
exports.SignNotVerified = SignNotVerified;
//# sourceMappingURL=signature.js.map
