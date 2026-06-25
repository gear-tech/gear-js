import { Sails, SailsProgram } from 'sails-js';
import { SailsIdlParser as V2Parser } from 'sails-js/parser';
import { SailsIdlParser as V1Parser } from 'sails-js-parser';

type ParsedSails = Sails | SailsProgram;

const isIdlV2 = (idl: string) => /!@sails:/.test(idl);

type SailsParser = (idl: string) => Promise<ParsedSails>;

const createSailsParser = async (): Promise<SailsParser> => {
  let v1Parser: V1Parser | undefined;
  let v2Parser: V2Parser | undefined;

  const getV1 = async () => {
    if (!v1Parser) {
      v1Parser = new V1Parser();
      await v1Parser.init();
    }

    return v1Parser;
  };

  const getV2 = async () => {
    if (!v2Parser) {
      v2Parser = new V2Parser();
      await v2Parser.init();
    }

    return v2Parser;
  };

  return async (idl: string) => {
    if (isIdlV2(idl)) {
      const parser = await getV2();

      return new SailsProgram(parser.parse(idl || ''));
    }

    const parser = await getV1();
    const sails = new Sails(parser);
    sails.parseIdl(idl || '');

    return sails;
  };
};

export type { ParsedSails, SailsParser };
export { createSailsParser, isIdlV2 };
