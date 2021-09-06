import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import io from 'socket.io-client';
import { Redirect } from 'react-router-dom';
import clsx from 'clsx';

import { PageHeader } from 'components/blocks/PageHeader';
import { EDITOR_BTNS, GEAR_LOCAL_IDE_URI, GEAR_STORAGE_KEY, PAGE_TYPES } from 'consts';
import { routes } from 'routes';

import EditorDownload from 'images/editor-download.svg';
import EditorBuild from 'images/editor-build.svg';
import EditorRun from 'images/editor-run.svg';
import EditorBuildRun from 'images/editor-build-run.svg';

import { EditorFolderRecord, EditorItem, EditorTypes, Languages } from 'types/editor';

import { EditorTree } from '../EditorTree';
import { FilesPanel } from './FilesPanel';
import { addParentToNode } from '../EditorTree/utils';
import { SimpleExample } from '../../../fixtures/code';

export const EditorPage = () => {
  const [files, setFiles] = useState<EditorFolderRecord>(addParentToNode(SimpleExample));
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [openedFiles, setOpenedFiles] = useState([0]);
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
  const socket = useRef(
    io(GEAR_LOCAL_IDE_URI, {
      transports: ['websocket'],
      query: { Authorization: `Bearer ${localStorage.getItem(GEAR_STORAGE_KEY)}` },
    })
  );

  useEffect(() => {
    socket.current.on('build', (payload: { files?: { file: ArrayBuffer; fileName: string }[]; error?: string }) => {
      if (payload.error) {
        // eslint-disable-next-line no-alert
        alert(payload.error);
      }
      if (payload.files) {
        // eslint-disable-next-line no-alert
        alert(`Your code build successfully, program name is ${payload.files[0].fileName}`);
      }
    });

    socket.current.on('exception', (payload: { status: string; message: string }) => {
      // eslint-disable-next-line no-alert
      alert(`An error occurred, with message: ${payload.message}`);
    });
  });

  function handleFileSelect(index: number) {
    if (!openedFiles.includes(index)) {
      setOpenedFiles([index, ...openedFiles.filter((openedFile) => openedFile !== index)]);
    }
    setCurrentFile(null);
  }

  async function createArchive() {
    const zip = new JSZip();
    // files.forEach((item) => {
    //   if (item.folder) {
    //     // @ts-ignore
    //     zip.folder(item.folder).file(`${item.name}`, item.value);
    //   } else {
    //     zip.file(`${item.name}`, item.value);
    //   }
    // });
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
        socket.current.emit('build', {
          file: val,
          projectName: programName.trim(),
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleClose() {
    setIsCodeEdited(true);
  }

  const handleClick = (node: EditorItem) => {
    console.log(node.path);
    setCurrentFile(node.path.join('/'));
    // console.log(node);
  };
  // const handleUpdate = (state: any) => {
  //   console.log(
  //     JSON.stringify(state, (key, value) => {
  //       if (key === 'parentNode' || key === 'id') {
  //         return null;
  //       }
  //       return value;
  //     })
  //   );
  // };

  function handleProgramNameChange(event: ChangeEvent) {
    const target = event.target as HTMLInputElement;
    const { value } = target;
    if ((value.trim().length && isProgramNameError) || (!value.trim().length && !isProgramNameError)) {
      setIsProgramNameError(!isProgramNameError);
    }
    setProgramName(target.value);
  }

  function handleFileClose(index: number) {
    const curOpened = openedFiles.filter((item) => item !== index);
    setOpenedFiles(curOpened);
    setCurrentFile(null);
  }

  function handleEditorChange(value: string | undefined) {
    console.log(value);
    if (value) {
      const copy = { ...files };
      // copy[currentFile].value = value;
      setFiles(copy);
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
  return (
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
              Build
            </button>
            <button className="editor-panel--actions__btn" type="button">
              <img src={EditorRun} alt="editor-run" />
              Run
            </button>
            <button className="editor-panel--actions__btn" type="button">
              <img src={EditorBuildRun} alt="editor-build-run" />
              Build & Run
            </button>
          </div>
        </div>
        <div className="editor-container">
          <EditorTree files={files} onNodeClick={handleClick} />
          <div className="editor-container__editor">
            {currentFile ? (
              <>
                <FilesPanel
                  /* @ts-ignore */
                  files={files.children.filter((i) => i.type === EditorTypes.file)}
                  openedFiles={openedFiles}
                  currentFile={0}
                  handleFileClose={handleFileClose}
                  handleFileSelect={handleFileSelect}
                />
                <Editor
                  theme="vs-dark"
                  options={options}
                  // value={files[currentFile].value}
                  // language={files[currentFile].lang}
                  value=""
                  language={Languages.Rust}
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
  );
};
