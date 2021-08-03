import React, { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import Editor from '@monaco-editor/react';
import JSZip from 'jszip';
import io from 'socket.io-client';
import { Tree } from './Tree';
import { GEAR_LOCAL_IDE_URI, GEAR_STORAGE_KEY } from '../../../consts';
import { EditorFile, Languages } from '../../../types/editor';

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
        console.log(val);
        saveAs(val, 'your-program.zip');
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
          projectName: 'amazing_project',
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleEditorChange(value: string | undefined) {
    if (value) {
      const copy = [...files];
      copy[currentFile].value = value;
      setFiles(copy);
    }
  }

  return (
    <div className="editor-container">
      <Tree files={files} selectFile={handleFileSelect} />
      <div className="editor-container__editor">
        <div className="editor-nav">
          <button type="button" className="editor-nav__btn" onClick={handleDownload}>
            Download
          </button>
          <button type="button" className="editor-nav__btn" onClick={handleBuild}>
            Build
          </button>
        </div>
        <Editor
          theme="vs-dark"
          options={options}
          value={files[currentFile].value}
          language={files[currentFile].lang}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
};
