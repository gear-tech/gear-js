import { nanoid } from 'nanoid';
import { EditorFolderRawRecord, EditorTypes, Languages } from '../types/editor';

export const SimpleExample: EditorFolderRawRecord = {
  root: {
    id: 'root',
    name: 'root',
    type: EditorTypes.folder,
    children: {
      src: {
        id: 'src',
        name: 'src',
        type: EditorTypes.folder,
        children: {
          'lib.rs': {
            id: 'lib.rs',
            name: 'lib.rs',
            type: EditorTypes.file,
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
          },
          src2: {
            id: 'src2',
            name: 'src2',
            type: EditorTypes.folder,
            children: {
              'lib2.rs': {
                id: '',
                name: 'lib2.rs',
                type: EditorTypes.file,
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
              },
            },
          },
        },
      },
      'Cargo.toml': {
        id: 'Cargo.toml',
        name: 'Cargo.toml',
        type: EditorTypes.file,
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
    },
  },
};
