import React, { ChangeEvent, useReducer, useEffect, useState } from 'react';
import { useAlert } from 'hooks';
import { saveAs } from 'file-saver';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import get from 'lodash.get';

import { PageHeader } from 'components/blocks/legacy/PageHeader/PageHeader';
import { useEditor } from 'hooks';
import { EDITOR_BTNS, PAGE_TYPES, WASM_COMPILER_BUILD, LOCAL_STORAGE } from 'consts';

import EditorDownload from 'assets/images/editor-download.svg';
import EditorBuild from 'assets/images/editor-build.svg';

import { EditorItem } from 'types/editor';
import { EditorTreeContext, reducer } from '../EditorTree/state';

import { EditorTree } from '../EditorTree';
import { addParentToNode } from '../EditorTree/utils';
import { SimpleExample } from '../../../fixtures/code';

import './styles.scss';

export const EditorPage = () => {
  const navigate = useNavigate();
  const alert = useAlert();

  const { isBuildDone, setIsBuildDone } = useEditor();

  const [state, dispatch] = useReducer(reducer, { tree: null });
  const [currentFile, setCurrentFile] = useState<string[] | null>(null);
  const [programName, setProgramName] = useState('');
  const [isProgramNameError, setIsProgramNameError] = useState(false);

  const options = {
    selectOnLineNumbers: true,
    fontSize: 14,
    fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    theme: 'vs-dark',
    language: 'rust',
  };

  useEffect(() => {
    dispatch({ type: 'SET_DATA', payload: addParentToNode(SimpleExample) });
  }, []);

  function createStructure(zip: any, path: string | null, filesList: any) {
    for (const key in filesList) {
      if (Object.prototype.hasOwnProperty.call(filesList, key)) {
        const file = filesList[key];
        let newPath = '';

        if (file.type === 'file') {
          if (path) {
            zip.folder(path).file(`${file.name}`, file.value);
          } else {
            zip.file(`${file.name}`, file.value);
          }
        } else {
          if (path) {
            newPath = `${path}/${file.name}`;
            zip.folder(newPath);
          } else {
            newPath = file.name;
            zip.folder(file.name);
          }

          createStructure(zip, newPath, file.children);
        }
      }
    }
  }

  async function createArchive() {
    const zip = new JSZip();

    if (state.tree) {
      createStructure(zip, null, state.tree.root.children);
    }

    return zip.generateAsync({ type: 'blob' });
  }

  function buildWasmProgram(val: any) {
    const formData = new FormData();

    formData.append('file', val);

    fetch(WASM_COMPILER_BUILD, {
      method: 'POST',
      body: formData,
    })
      .then((data) => data.json())
      .then((json) => {
        localStorage.setItem(LOCAL_STORAGE.PROGRAM_COMPILE_ID, json.id);
        setIsBuildDone(true);
        alert.success('Compiling, please wait!');
      });
  }

  function handleDownload() {
    createArchive()
      .then((val: any) => {
        saveAs(val, `${programName.trim()}.zip`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleBuild() {
    createArchive()
      .then((val: any) => {
        buildWasmProgram(val);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleClose() {
    navigate(-1);
  }

  function onNodeClick(node: EditorItem) {
    setCurrentFile(node.path);
  }

  function handleProgramNameChange(event: ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    if ((value.trim().length && isProgramNameError) || (!value.trim().length && !isProgramNameError)) {
      setIsProgramNameError(!isProgramNameError);
    }
    setProgramName(target.value);
  }

  function handleEditorChange(value: string | undefined) {
    if (currentFile) {
      const file = get(state.tree, currentFile);
      dispatch({ type: 'UPDATE_VALUE', payload: { nodeId: file.id, value } });
    }
  }

  function handlePanelBtnClick(type: string) {
    if (!programName.trim().length) {
      setIsProgramNameError(true);
      return;
    }
    if (type === EDITOR_BTNS.DOWNLOAD) {
      handleDownload();
    } else if (type === EDITOR_BTNS.BUILD) {
      handleBuild();
    }
  }

  function getCurrFileName() {
    let value = '';

    if (currentFile) {
      value = get(state.tree, currentFile).value;
    }

    return value;
  }

  function getCurrFileLang() {
    let lang = '';

    if (currentFile) {
      lang = get(state.tree, currentFile).lang;
    }

    return lang;
  }

  // @ts-ignore
  /* eslint-disable react/jsx-no-bind */
  return (
    <EditorTreeContext.Provider
      value={{
        state,
        dispatch,
        onNodeClick,
        setCurrentFile,
      }}
    >
      <div className="editor-page">
        <PageHeader programName={programName} pageType={PAGE_TYPES.EDITOR_PAGE} handleClose={handleClose} />
        <div className="editor-content">
          <div className="editor-panel">
            <div className="editor-panel--form">
              <span className="editor-panel--form__label">Program name:</span>
              <input
                type="text"
                className={clsx('editor-panel--form__input', isProgramNameError && 'error')}
                value={programName}
                onChange={handleProgramNameChange}
              />
            </div>
            {isBuildDone && <div className="editor-panel--text">Compiling ...</div>}
            <div className="editor-panel--actions">
              <button
                className="editor-panel--actions__btn"
                type="button"
                onClick={() => handlePanelBtnClick(EDITOR_BTNS.DOWNLOAD)}
              >
                <img src={EditorDownload} alt="editor-download" />
                Download
              </button>
              <button
                className="editor-panel--actions__btn"
                type="button"
                onClick={() => handlePanelBtnClick(EDITOR_BTNS.BUILD)}
                disabled={isBuildDone}
              >
                <img src={EditorBuild} alt="editor-build" />
                Compile
              </button>
            </div>
          </div>
          <div className="editor-container">
            <EditorTree />
            <div className="editor-container__editor">
              {currentFile ? (
                <>
                  <Editor
                    theme="vs-dark"
                    options={options}
                    value={getCurrFileName()}
                    language={getCurrFileLang()}
                    onChange={handleEditorChange}
                  />
                </>
              ) : (
                <div className="editor-empty">Please select at least one file</div>
              )}
            </div>
          </div>
        </div>
        <span className="editor-page__footer-text">2022. All rights reserved.</span>
      </div>
    </EditorTreeContext.Provider>
  );
};
