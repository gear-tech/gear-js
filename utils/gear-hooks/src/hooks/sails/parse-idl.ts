import { Sails, SailsProgram } from 'sails-js';
import { SailsIdlParser as V2Parser } from 'sails-js/parser';
import { SailsIdlParser as V1Parser } from 'sails-js-parser';

type ParsedSails = Sails | SailsProgram;

const isIdlV2 = (idl: string) => /!@sails:/.test(idl);

type SailsParser = (idl: string) => ParsedSails;

const createSailsParser = async (): Promise<SailsParser> => {
  const v1Parser = new V1Parser();
  const v2Parser = new V2Parser();

  await Promise.all([v1Parser.init(), v2Parser.init()]);

  return (idl: string) => {
    if (isIdlV2(idl)) return new SailsProgram(v2Parser.parse(idl || ''));

    const sails = new Sails(v1Parser);
    sails.parseIdl(idl || '');

    return sails;
  };
};

export type { ParsedSails, SailsParser };
export { createSailsParser, isIdlV2 };
