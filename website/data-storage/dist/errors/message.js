'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.MessageNotFound = void 0;
const base_1 = require('./base');
class MessageNotFound extends base_1.GearError {
  constructor() {
    super(...arguments);
    this.name = 'MessageNotFound';
    this.message = 'Message not found';
  }
}
exports.MessageNotFound = MessageNotFound;
//# sourceMappingURL=message.js.map
