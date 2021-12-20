'use strict';
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.KafkaLogger = exports.Logger = void 0;
const winston_1 = require('winston');
const kafkajs_1 = require('kafkajs');
const chalk = require('chalk');
const { printf, combine, colorize, timestamp, label } = winston_1.format;
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${chalk.cyan(timestamp)} ${level} ${chalk.magenta(`[${label}]`)} ${message}`;
});
const Logger = (labelName) =>
  (0, winston_1.createLogger)({
    level: 'debug',
    format: combine(
      (0, winston_1.format)((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      colorize(),
      label({ label: labelName }),
      timestamp({ format: 'DD/mm/YY HH:mm:ss' }),
      logFormat,
    ),
    transports: [new winston_1.transports.Console()],
  });
exports.Logger = Logger;
const toWinstonLogLevel = (level) => {
  switch (level) {
    case kafkajs_1.logLevel.ERROR:
    case kafkajs_1.logLevel.NOTHING:
      return 'error';
    case kafkajs_1.logLevel.WARN:
      return 'warn';
    case kafkajs_1.logLevel.INFO:
      return 'info';
    case kafkajs_1.logLevel.DEBUG:
    default:
      return 'debug';
  }
};
const KafkaLogger = (loggerLevel) => (_a) => {
  var _b = _a.log,
    { message } = _b,
    extra = __rest(_b, ['message']);
  const { timestamp, logger } = extra,
    extraFields = __rest(extra, ['timestamp', 'logger']);
  return (0, exports.Logger)('Kafka').log({
    level: toWinstonLogLevel(loggerLevel),
    message: `${message} ${JSON.stringify(extraFields)}`,
  });
};
exports.KafkaLogger = KafkaLogger;
//# sourceMappingURL=logger.js.map
