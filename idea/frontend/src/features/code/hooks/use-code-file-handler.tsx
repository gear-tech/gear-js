import { HexString, generateCodeHash } from '@gear-js/api';
import { useApi, useAlert } from '@gear-js/react-hooks';
import { generatePath } from 'react-router-dom';

import { routes } from '@/shared/config';
import { CustomLink } from '@/shared/ui/customLink';

type OnChange = (value: File | undefined) => void;

// upload-code feature?
function useCodeFileHandler(onChange: OnChange = () => {}) {
  const { api, isApiReady } = useApi();
  const alert = useAlert();

  const renderCodeExistsAlert = (codeId: HexString) => (
    <>
      <p>Code already exists</p>
      <p>
        ID: <CustomLink to={generatePath(routes.code, { codeId })} text={codeId} />
      </p>
    </>
  );

  return async (value: File | undefined) => {
    if (!isApiReady) throw new Error('API is not initialized');
    if (!value) return onChange(undefined);

    const arrayBuffer = await value.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const codeId = generateCodeHash(buffer);
    const isExists = await api.code.exists(codeId);
    if (isExists) return alert.error(renderCodeExistsAlert(codeId));

    onChange(value);
  };
}

export { useCodeFileHandler };
