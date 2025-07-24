import { useQuery } from '@tanstack/react-query';
import { Sails } from 'sails-js';
import { SailsIdlParser } from 'sails-js-parser';

const useSails = (idl: string) => {
  const initSails = async () => {
    const parser = new SailsIdlParser();
    const sails = new Sails(parser);

    await parser.init();
    sails.parseIdl(idl);

    return sails;
  };

  return useQuery({
    queryKey: ['initSails', idl],
    queryFn: initSails,
    enabled: !!idl,
  });
};

export { useSails };
