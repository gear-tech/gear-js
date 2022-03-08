import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import saveAs from 'file-saver';
import { EditorContext } from './Context';
import { Props } from '../types';
import { LOCAL_STORAGE, WASM_COMPILER_GET } from 'consts';

const { Provider } = EditorContext;

const useEditor = () => {
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
                // AddAlert({ type: EventTypes.SUCCESS, message: `Program is ready!` }
              });
            });
          })
          .catch((err) => console.error(err));
      }, 20000);
    }

    return () => {
      clearInterval(timerId);
    };
  }, [isBuildDone]);

  return { isBuildDone, setIsBuildDone };
};

const EditorProvider = ({ children }: Props) => <Provider value={useEditor()}>{children}</Provider>;

export { EditorProvider };
