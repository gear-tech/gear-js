import { HomeCreateSection } from 'components/sections/home-create-section';
import { useAlert, useApi } from '@gear-js/react-hooks';
import { useEffect } from 'react';
import txt from '../assets/meta/meta.txt';
import { getProgramMetadata } from '@gear-js/api';

export const Home = () => {
  const alert = useAlert();
  const { api } = useApi();
  useEffect(() => {
    fetch(txt)
      .then((response) => response.text() as Promise<string>)
      .then(async (data) => {
        const metadata = getProgramMetadata(`0x${data}`);
        const input = metadata.types.init.input;
        const output = metadata.types.init.input;
        console.log({ data, metadata, input, output });
        // console.log(metadata.getTypeDef(4));

        // console.log(api);

        const result = await api.programState.read(
          { programId: '0x4544c718d4aa1545dc3db3327c1e79d26fe9c0e17a13cb4d7de355cc83715b4a' },
          metadata,
        );

        console.log(result);
      })
      .catch(({ message }: Error) => alert.error(message));
  }, [alert, api]);

  return (
    <>
      <HomeCreateSection />
    </>
  );
};
