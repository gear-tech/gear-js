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
              '\n' +
              'use codec::{Decode, Encode};\n' +
              'use gstd::{msg, prelude::*};\n' +
              'use scale_info::TypeInfo;\n' +
              '\n' +
              '#[derive(TypeInfo, Decode)]\n' +
              'pub enum Action {\n' +
              '    AddMessage(MessageIn),\n' +
              '    ViewMessages,\n' +
              '}\n' +
              '\n' +
              '#[derive(TypeInfo, Decode, Encode)]\n' +
              'pub struct MessageIn {\n' +
              '    author: String,\n' +
              '    msg: String,\n' +
              '}\n' +
              '\n' +
              'gstd::metadata! {\n' +
              '    title: "Guestbook",\n' +
              '    handle:\n' +
              '        input: Action,\n' +
              '        output: Vec<MessageIn>,\n' +
              '}\n' +
              '\n' +
              'static mut MESSAGES: Vec<MessageIn> = Vec::new();\n' +
              '\n' +
              '#[no_mangle]\n' +
              'pub unsafe extern "C" fn handle() {\n' +
              '    let action: Action = msg::load().unwrap();\n' +
              '\n' +
              '    match action {\n' +
              '        Action::AddMessage(message) => {\n' +
              '            MESSAGES.push(message);\n' +
              '        }\n' +
              '        Action::ViewMessages => {\n' +
              '            msg::reply(&MESSAGES, 0, 0);\n' +
              '        }\n' +
              '    }\n' +
              '}\n' +
              '\n' +
              '#[no_mangle]\n' +
              'pub unsafe extern "C" fn init() {}',
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
          'name = "guestbook"\n' +
          'version = "0.1.0"\n' +
          'authors = ["Gear Technologies"]\n' +
          'edition = "2018"\n' +
          'license = "GPL-3.0"\n' +
          '\n' +
          '[lib]\n' +
          'crate-type = ["cdylib"]\n' +
          '\n' +
          '[dependencies]\n' +
          'gstd = { git = "https://github.com/gear-tech/gear", features = ["debug"] }\n' +
          'scale-info = { version = "1.0.0", default-features = false, features = ["derive"] }\n' +
          'codec = { package = "parity-scale-codec", version = "2.0.0", default-features = false, features = ["derive"] }',
      },
    },
  },
};
