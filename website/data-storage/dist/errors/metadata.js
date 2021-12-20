'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.MetadataNotFound = void 0;
const base_1 = require('./base');
class MetadataNotFound extends base_1.GearError {
  constructor() {
    super(...arguments);
    this.name = 'MetadataNotFound';
    this.message = 'Metadata not found';
  }
}
exports.MetadataNotFound = MetadataNotFound;
//# sourceMappingURL=metadata.js.map
