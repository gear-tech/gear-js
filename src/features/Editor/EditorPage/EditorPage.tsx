import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { saveAs } from 'file-saver';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import io from 'socket.io-client';
import { Redirect } from "react-router-dom";
import clsx from 'clsx';

import { PageHeader } from 'components/blocks/PageHeader';
import { EDITOR_BTNS, GEAR_LOCAL_IDE_URI, GEAR_STORAGE_KEY, PAGE_TYPES } from 'consts';
import { routes } from "routes";

import EditorDownload from 'images/editor-download.svg';
import EditorBuild from 'images/editor-build.svg';
import EditorRun from 'images/editor-run.svg';
import EditorBuildRun from 'images/editor-build-run.svg';

import { EditorFile, Languages } from 'types/editor';

import { Tree } from './Tree';
import { FilesPanel } from './FilesPanel';

export const EditorPage = () => {
  const [files, setFiles] = useState<EditorFile[]>([
    {
      name: 'lib.rs',
      lang: Languages.Rust,
      value:
        '#![no_std]\n' +
        '#![feature(default_alloc_error_handler)]\n' +
        '\n' +
        'use gstd::{msg, prelude::*};\n' +
        '\n' +
        '#[no_mangle]\n' +
        'pub unsafe extern "C" fn handle() {\n' +
        '    msg::reply(b"Hello world!", 0, 0);\n' +
        '}\n' +
        '\n' +
        '#[no_mangle]\n' +
        'pub unsafe extern "C" fn init() {}\n' +
        '\n' +
        '#[panic_handler]\n' +
        'fn panic(_info: &panic::PanicInfo) -> ! {\n' +
        '    loop {}\n' +
        '}',
      folder: 'src',
    },
    {
      name: 'Cargo.toml',
      lang: Languages.Toml,
      value:
        '[package]\n' +
        'name = "demo-minimal"\n' +
        'version = "0.1.0"\n' +
        'authors = ["Gear Technologies"]\n' +
        'edition = "2018"\n' +
        'license = "GPL-3.0"\n' +
        '\n' +
        '[lib]\n' +
        'crate-type = ["cdylib"]\n' +
        '\n' +
        '[dependencies]\n' +
        'gstd = { path = "../../gstd", features = ["debug"] }',
    },
  ]);
  const [currentFile, setCurrentFile] = useState(0);
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
      setOpenedFiles([index, ...openedFiles.filter(openedFile => openedFile !== index)])
    }
    console.log('select')
    setCurrentFile(index);
  }

  async function createArchive() {
    const zip = new JSZip();
    files.forEach((item) => {
      if (item.folder) {
        // @ts-ignore
        zip.folder(item.folder).file(`${item.name}`, item.value);
      } else {
        zip.file(`${item.name}`, item.value);
      }
    });
    return await zip.generateAsync({ type: 'blob' });
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

  function handleProgramNameChange(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    if (value.trim().length && isProgramNameError || !value.trim().length && !isProgramNameError) {
      setIsProgramNameError(!isProgramNameError);
    }
    setProgramName(target.value)
  }

  function handleFileClose(index: number) {
    const curOpened = openedFiles.filter(item => item !== index);
    setOpenedFiles(curOpened);
    setCurrentFile(curOpened[0]);
  }

  function handleEditorChange(value: string | undefined) {
    if (value) {
      const copy = [...files];
      copy[currentFile].value = value;
      setFiles(copy);
    }
  }

  function handlePanelBtnClick(type: string) {
    if (!programName.trim().length) {
      setIsProgramNameError(true);
      return;
    }
    if (type === EDITOR_BTNS.DOWNLOAD) {
      handleDownload()
    } else if (type === EDITOR_BTNS.BUILD) {
      handleBuild();
    }
  }

  if (isCodeEdited) {
    return <Redirect to={{
        pathname: routes.main
    }}/>
  }

  return (
    <div className="editor-page">
      <PageHeader programName={programName} pageType={PAGE_TYPES.EDITOR_PAGE} handleClose={handleClose}/>
      <div className="editor-content">
        <div className="editor-panel">
          <div className="editor-panel--form">
            <span className="editor-panel--form__label">Program name:</span>
            <input type="text" className={clsx('editor-panel--form__input', isProgramNameError && 'error')} value={programName} onChange={handleProgramNameChange}/>
          </div>
          <div className="editor-panel--actions">
            <button className="editor-panel--actions__btn" type="button" onClick={() => handlePanelBtnClick(EDITOR_BTNS.DOWNLOAD)}>
              <img src={EditorDownload} alt="editor-download" />
              Download
            </button>
            <button className="editor-panel--actions__btn" type="button" onClick={() => handlePanelBtnClick(EDITOR_BTNS.BUILD)}>
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
          <Tree files={files} selectFile={handleFileSelect} currentFile={currentFile}/>
          <div className="editor-container__editor">
            <FilesPanel 
              files={files} 
              openedFiles={openedFiles} 
              currentFile={currentFile} 
              handleFileClose={handleFileClose} 
              handleFileSelect={handleFileSelect}/>
              <Editor
                theme="vs-dark"
                options={options}
                value={files[currentFile].value}
                language={files[currentFile].lang}
                onChange={handleEditorChange}
              />
          </div>
        </div>
      </div>
      <span className="editor-page__footer-text">
        2021. All rights reserved.
      </span>
    </div>
  );
};