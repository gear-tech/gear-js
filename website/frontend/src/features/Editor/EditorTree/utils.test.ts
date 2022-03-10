import { EditorFile, EditorFolderRawRecord, EditorFolderRecord, EditorTypes, Languages } from '../../../types/editor';
import { addParentToNode, findNode } from './utils';

describe('test tree utils', () => {
  let tree: EditorFolderRawRecord | null = null;
  let treeWithParents: EditorFolderRecord | null = null;

  beforeEach(() => {
    tree = {
      root: {
        name: 'root',
        type: EditorTypes.folder,
        id: 'root',
        children: {
          src: {
            id: 'src',
            name: 'src',
            type: EditorTypes.folder,
            children: {
              'src/lib.rs': {
                id: 'src/lib.rs',
                name: 'lib.rs',
                type: EditorTypes.file,
                lang: Languages.Rust,
                value: 'lib.rs',
              },
              'src/sub': {
                id: 'src/sub',
                name: 'sub',
                type: EditorTypes.folder,
                children: {
                  'src/sub/lib.rs': {
                    id: 'src/sub/lib.rs',
                    name: 'lib.rs',
                    type: EditorTypes.file,
                    lang: Languages.Rust,
                    value: 'lib.rs',
                  },
                },
              },
            },
          },
          src2: {
            id: 'src2',
            name: 'src2',
            type: EditorTypes.folder,
            children: {
              'src2/lib.rs': {
                id: 'src2/lib.rs',
                name: 'lib.rs',
                type: EditorTypes.file,
                lang: Languages.Rust,
                value: 'lib.rs',
              },
              'src2/sub': {
                id: 'src2/sub',
                name: 'sub',
                type: EditorTypes.folder,
                children: {
                  'src2/sub/lib.rs': {
                    id: 'src2/sub/lib.rs',
                    name: 'lib.rs',
                    type: EditorTypes.file,
                    lang: Languages.Rust,
                    value: 'lib.rs',
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
            value: 'Cargo.toml',
          },
        },
      },
    } as EditorFolderRawRecord;

    treeWithParents = {
      root: {
        name: 'root',
        type: EditorTypes.folder,
        id: 'root',
        parentId: 'root',
        path: ['root'],
        children: {
          src: {
            id: 'src',
            name: 'src',
            type: EditorTypes.folder,
            parentId: 'root',
            path: ['root', 'children', 'src'],
            children: {
              'src/lib.rs': {
                id: 'src/lib.rs',
                name: 'lib.rs',
                type: EditorTypes.file,
                lang: Languages.Rust,
                value: 'lib.rs',
                parentId: 'src',
                path: ['root', 'children', 'src', 'children', 'src/lib.rs'],
              },
              'src/sub': {
                id: 'src/sub',
                name: 'sub',
                type: EditorTypes.folder,
                parentId: 'src',
                path: ['root', 'children', 'src', 'children', 'src/sub'],
                children: {
                  'src/sub/lib.rs': {
                    id: 'src/sub/lib.rs',
                    name: 'lib.rs',
                    type: EditorTypes.file,
                    lang: Languages.Rust,
                    value: 'lib.rs',
                    parentId: 'src/sub',
                    path: ['root', 'children', 'src', 'children', 'src/sub', 'children', 'src/sub/lib.rs'],
                  },
                },
              },
            },
          },
          src2: {
            id: 'src2',
            name: 'src2',
            type: EditorTypes.folder,
            parentId: 'root',
            path: ['root', 'children', 'src2'],
            children: {
              'src2/lib.rs': {
                id: 'src2/lib.rs',
                name: 'lib.rs',
                type: EditorTypes.file,
                lang: Languages.Rust,
                value: 'lib.rs',
                parentId: 'src2',
                path: ['root', 'children', 'src2', 'children', 'src2/lib.rs'],
              },
              'src2/sub': {
                id: 'src2/sub',
                name: 'sub',
                type: EditorTypes.folder,
                parentId: 'src2',
                path: ['root', 'children', 'src2', 'children', 'src2/sub'],
                children: {
                  'src2/sub/lib.rs': {
                    id: 'src2/sub/lib.rs',
                    name: 'lib.rs',
                    type: EditorTypes.file,
                    lang: Languages.Rust,
                    value: 'lib.rs',
                    parentId: 'src2/sub',
                    path: ['root', 'children', 'src2', 'children', 'src2/sub', 'children', 'src2/sub/lib.rs'],
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
            value: 'Cargo.toml',
            parentId: 'root',
            path: ['root', 'children', 'Cargo.toml'],
          },
        },
      },
    };
  });

  it('adds parent node and path to each child deep', () => {
    expect(addParentToNode(tree!)).toEqual(treeWithParents);
  });

  it('deep file find', () => {
    // @ts-ignore
    const target: EditorFile = treeWithParents!.root.children.src2.children['src2/sub'].children['src2/sub/lib.rs'];

    expect(findNode(treeWithParents!, target.id)).toEqual(target);
  });

  it('deep folder find', () => {
    // @ts-ignore
    const target: EditorFile = treeWithParents!.root.children.src2.children['src2/sub'].children['src2/sub/lib.rs'];

    expect(findNode(treeWithParents!, target.id)).toEqual(target);
  });

  it('first level file find', () => {
    // @ts-ignore
    const target: EditorFile = treeWithParents!.root.children['Cargo.toml'];

    expect(findNode(treeWithParents!, target.id)).toEqual(target);
  });

  it('first level folder find', () => {
    // @ts-ignore
    const target: EditorFile = treeWithParents!.root.children.src2;

    expect(findNode(treeWithParents!, target.id)).toEqual(target);
  });

  it('find unavailable node', () => {
    expect(findNode(treeWithParents!, 'unavailable')).toEqual(null);
  });
});
