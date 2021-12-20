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
exports.Program = exports.InitStatus = void 0;
const meta_entity_1 = require('../../metadata/entities/meta.entity');
const typeorm_1 = require('typeorm');
var InitStatus;
(function (InitStatus) {
  InitStatus['SUCCESS'] = 'success';
  InitStatus['FAILED'] = 'failed';
  InitStatus['PROGRESS'] = 'in progress';
})((InitStatus = exports.InitStatus || (exports.InitStatus = {})));
let Program = class Program {};
__decorate([(0, typeorm_1.PrimaryColumn)(), __metadata('design:type', String)], Program.prototype, 'id', void 0);
__decorate(
  [(0, typeorm_1.Index)(), (0, typeorm_1.Column)({ nullable: false }), __metadata('design:type', String)],
  Program.prototype,
  'chain',
  void 0,
);
__decorate(
  [(0, typeorm_1.Index)(), (0, typeorm_1.Column)(), __metadata('design:type', String)],
  Program.prototype,
  'genesis',
  void 0,
);
__decorate(
  [(0, typeorm_1.Index)(), (0, typeorm_1.Column)(), __metadata('design:type', String)],
  Program.prototype,
  'owner',
  void 0,
);
__decorate([(0, typeorm_1.Column)(), __metadata('design:type', String)], Program.prototype, 'name', void 0);
__decorate([(0, typeorm_1.Column)(), __metadata('design:type', Date)], Program.prototype, 'uploadedAt', void 0);
__decorate(
  [
    (0, typeorm_1.OneToOne)(() => meta_entity_1.Meta, { nullable: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata('design:type', meta_entity_1.Meta),
  ],
  Program.prototype,
  'meta',
  void 0,
);
__decorate(
  [(0, typeorm_1.Column)({ nullable: true }), __metadata('design:type', String)],
  Program.prototype,
  'title',
  void 0,
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'enum', enum: InitStatus, default: InitStatus.PROGRESS }),
    __metadata('design:type', String),
  ],
  Program.prototype,
  'initStatus',
  void 0,
);
Program = __decorate([(0, typeorm_1.Entity)()], Program);
exports.Program = Program;
//# sourceMappingURL=program.entity.js.map
