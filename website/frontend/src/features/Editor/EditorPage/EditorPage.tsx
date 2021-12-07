import React, { ChangeEvent, useReducer, useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';
import get from 'lodash.get';

import { PageHeader } from 'components/blocks/PageHeader/PageHeader';
import { EDITOR_BTNS, PAGE_TYPES } from 'consts';
import { routes } from 'routes';

import EditorDownload from 'assets/images/editor-download.svg';
import EditorBuild from 'assets/images/editor-build.svg';

import { EditorItem } from 'types/editor';
import { EditorTreeContext, reducer } from '../EditorTree/state';

import { EditorTree } from '../EditorTree';
import { addParentToNode } from '../EditorTree/utils';
import { SimpleExample } from '../../../fixtures/code';

export const EditorPage = () => {
  const [state, dispatch] = useReducer(reducer, { tree: null });
  const [currentFile, setCurrentFile] = useState<string[] | null>(null);
  const [isCodeEdited, setIsCodeEdited] = useState(false);
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

  function handleDownload() {
    createArchive()
      .then((val) => {
        saveAs(val, `${programName.trim()}.zip`);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleBuild() {
    createArchive()
      .then((val) => {
        console.log(val);
        // socket.current.emit('build', {
        //   file: val,
        //   projectName: programName.trim(),
        // });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleClose() {
    setIsCodeEdited(true);
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

  if (isCodeEdited) {
    return (
      <Redirect
        to={{
          pathname: routes.main,
        }}
      />
    );
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
        <span className="editor-page__footer-text">2021. All rights reserved.</span>
      </div>
    </EditorTreeContext.Provider>
  );
};
