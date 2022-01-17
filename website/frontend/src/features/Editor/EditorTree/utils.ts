import {
  EditorFolderRawRecord,
  EditorFolderRecord,
  EditorItem,
  EditorTypes,
  Languages,
  NodeId,
} from '../../../types/editor';

export const cloneDeep = (data: object) => JSON.parse(JSON.stringify(data));

export const getLangFromName = (name: string): Languages => {
  const split = name.split('.');
  const ext = split && split[split.length - 1];
  switch (ext) {
    case 'rs':
      return Languages.Rust;
    case 'toml':
      return Languages.Toml;
    default:
      return Languages.Txt;
  }
};

export class Stack<T> {
  private arr: T[] = [];

  push(item: T) {
    this.arr.push(item);
  }

  pop(): T | undefined {
    return this.arr.pop();
  }

  peek(): T | undefined {
    return this.arr[this.arr.length - 1];
  }

  get length() {
    return this.arr.length;
  }

  isEmpty(): boolean {
    return this.arr.length === 0;
  }
}

export const findNode = (root: EditorFolderRecord, nodeId: NodeId) => {
  const stack = new Stack<EditorItem>();
  stack.push(root.root);

  while (stack.length > 0) {
    const current = stack.pop();
    if (current && current.id === nodeId) {
      return current;
    }

    if (current && current.type === EditorTypes.folder) {
      Object.entries(current.children).forEach(([key, val]) => {
        const path = [...current.path, 'children'];
        // eslint-disable-next-line no-param-reassign
        val.parentId = current.id;
        // eslint-disable-next-line no-param-reassign
        val.path = [...path, key];
        stack.push(val);
      });
    }
  }

  return null;
};

export const addParentToNode = (root: EditorFolderRawRecord) => {
  const stack = new Stack<EditorItem>();
  const clone: EditorFolderRecord = cloneDeep(root);
  // add default id for root node
  clone.root.parentId = 'root';
  clone.root.path = ['root'];
  stack.push(clone.root);

  while (stack.length > 0) {
    const current = stack.pop();
    if (current && current.type === EditorTypes.folder) {
      Object.entries(current.children).forEach(([key, val]) => {
        const path = [...current.path, 'children'];
        // eslint-disable-next-line no-param-reassign
        val.parentId = current.id;
        // eslint-disable-next-line no-param-reassign
        val.path = [...path, key];
        stack.push(val);
      });
    }
  }

  return clone;
};
