import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import io from 'socket.io-client';
import { Tree } from './Tree';
import { GEAR_LOCAL_IDE_URI, GEAR_STORAGE_KEY } from '../../../consts';

interface IMonaco {
  options: any;
  code: string;
}

// @ts-ignore
// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorkerUrl(_moduleId: any, label: string) {
    if (label === 'json') {
      return './json.worker.bundle.js';
    }
    if (label === 'toml') {
      return './toml.worker.bundle.js';
    }
    if (label === 'rust') {
      return './rust.worker.bundle.js';
    }
    return './editor.worker.bundle.js';
  },
};

const Monaco = ({ options, code }: IMonaco) => {
  const editorEl = useRef<HTMLDivElement>(null);
  const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorEl.current) {
      editor.current = monaco.editor.create(editorEl.current, { ...options, value: code });
    }
    return () => {
      if (editor.current) {
        editor.current.dispose();
      }
    };
  });

  return <div className="editor-element" ref={editorEl} />;
};

const files = [
  {
    name: 'lib',
    ext: 'rs',
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
    name: 'Cargo',
    ext: 'toml',
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
];

export const EditorPage = () => {
  const [file, setFile] = useState(files.filter((i) => i.value)[0]);
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
      console.log(payload);
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

  function handleFileSelect(name: string) {
    const item = files.find((i) => i.name === name);
    if (item) {
      setFile(item);
    }
  }

  async function createArchive() {
    const zip = new JSZip();
    files.forEach((item) => {
      if (item.folder) {
        // @ts-ignore
        zip.folder(item.folder).file(`${item.name}.${item.ext}`, item.value);
      } else {
        zip.file(`${item.name}.${item.ext}`, item.value);
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
        {/* @ts-ignore */}
        <Monaco options={options} code={file.value} />
      </div>
    </div>
  );
};
