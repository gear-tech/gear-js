import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { useAlert } from '@gear-js/react-hooks';

import { Props } from '../types';
import { EditorContext } from './Context';

import { LOCAL_STORAGE, WASM_COMPILER_GET } from 'consts';

const { Provider } = EditorContext;

const useEditor = () => {
  const alert = useAlert();
  const [isBuildDone, setIsBuildDone] = useState(false);

  useEffect(() => {
    let timerId: any;

    if (localStorage.getItem(LOCAL_STORAGE.PROGRAM_COMPILE_ID)) {
      const id = localStorage.getItem(LOCAL_STORAGE.PROGRAM_COMPILE_ID);

      timerId = setInterval(() => {
        fetch(WASM_COMPILER_GET, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ id }),
        })
          .then((data) => data.json())
          .then((json) => {
            const zip = new JSZip();

            zip.loadAsync(json.file.data).then((data) => {
              data.generateAsync({ type: 'blob' }).then((val) => {
                saveAs(val, `program.zip`);
                setIsBuildDone(false);
                localStorage.removeItem(LOCAL_STORAGE.PROGRAM_COMPILE_ID);
                clearInterval(timerId);
                alert.success('Program is ready!');
              });
            });
          })
          .catch((err) => console.error(err));
      }, 20000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [isBuildDone, alert]);

  return { isBuildDone, setIsBuildDone };
};

const EditorProvider = ({ children }: Props) => <Provider value={useEditor()}>{children}</Provider>;

export { EditorProvider };
