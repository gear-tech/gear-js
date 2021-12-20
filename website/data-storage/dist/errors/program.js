'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.ProgramNotFound = void 0;
const base_1 = require('./base');
class ProgramNotFound extends base_1.GearError {
  constructor() {
    super(...arguments);
    this.name = 'ProgramNotFound';
    this.message = 'Program not found';
  }
}
exports.ProgramNotFound = ProgramNotFound;
//# sourceMappingURL=program.js.map
