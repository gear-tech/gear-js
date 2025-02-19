import { ProgramMetadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Input, Textarea } from '@gear-js/ui';
import { useMemo } from 'react';

import { getNamedTypes } from '@/features/uploadMetadata';
import { getPreformattedText } from '@/shared/helpers';

type Props = {
  value: ProgramMetadata;
};

function MetadataPreview({ value }: Props) {
  const alert = useAlert();

  // useMemo to prevent excessive error alerts
  const namedTypeEntries = useMemo(() => {
    if (!value) return [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO(#1800): resolve eslint comments
    const types = getNamedTypes(value, (message) => alert.error(message));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- TODO(#1800): resolve eslint comments
    return Object.entries(types);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const registryTypes = useMemo(() => value.getAllTypes(), [value]);

  const renderTypes = () =>
    namedTypeEntries.map(([key, _value]) => (
      <Input key={key} label={key} direction="y" value={JSON.stringify(_value)} block readOnly />
    ));

  return (
    <>
      {renderTypes()}
      <Textarea label="types" direction="y" value={getPreformattedText(registryTypes)} block readOnly />
    </>
  );
}

export { MetadataPreview };
