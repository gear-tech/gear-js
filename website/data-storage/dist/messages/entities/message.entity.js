'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function') return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Message = void 0;
const typeorm_1 = require('typeorm');
let Message = class Message {};
__decorate([(0, typeorm_1.PrimaryColumn)(), __metadata('design:type', String)], Message.prototype, 'id', void 0);
__decorate(
  [(0, typeorm_1.Index)(), (0, typeorm_1.Column)(), __metadata('design:type', String)],
  Message.prototype,
  'chain',
  void 0,
);
__decorate(
  [(0, typeorm_1.Index)(), (0, typeorm_1.Column)(), __metadata('design:type', String)],
  Message.prototype,
  'genesis',
  void 0,
);
__decorate(
  [(0, typeorm_1.Index)(), (0, typeorm_1.Column)(), __metadata('design:type', String)],
  Message.prototype,
  'destination',
  void 0,
);
__decorate(
  [(0, typeorm_1.Index)(), (0, typeorm_1.Column)(), __metadata('design:type', String)],
  Message.prototype,
  'source',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ nullable: true }), __metadata('design:type', String)],
  Message.prototype,
  'payload',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ nullable: true }), __metadata('design:type', String)],
  Message.prototype,
  'replyTo',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ nullable: true }), __metadata('design:type', String)],
  Message.prototype,
  'replyError',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ default: false }), __metadata('design:type', Boolean)],
  Message.prototype,
  'isRead',
  void 0,
);
__decorate([(0, typeorm_1.Column)(), __metadata('design:type', Date)], Message.prototype, 'date', void 0);
Message = __decorate([(0, typeorm_1.Entity)()], Message);
exports.Message = Message;
//# sourceMappingURL=message.entity.js.map
