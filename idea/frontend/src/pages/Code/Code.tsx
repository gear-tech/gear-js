import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAlert } from '@gear-js/react-hooks';

import { Params } from './types';

import { getCode } from 'services';
import { CodeModel } from 'types/code';
import { Box } from 'layout/Box/Box';
import { PageHeader } from 'components/blocks/PageHeader';
import { ProgramForm } from 'components/blocks/ProgramForm';
import { Spinner } from 'components/common/Spinner/Spinner';

const Code = () => {
  const alert = useAlert();
  const { codeId } = useParams() as Params;

  const [code, setCode] = useState<CodeModel>();

  useEffect(() => {
    getCode(codeId)
      .then(({ result }) => setCode(result))
      .catch((error) => alert.error(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="wrapper">
      <PageHeader title="Create program" fileName={codeId} />
      {code ? <Box>{/* <ProgramForm code={code} /> */}</Box> : <Spinner absolute />}
    </div>
  );
};

export { Code };
