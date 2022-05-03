import isObject from 'lodash.isobject';
import { PreparedMetaData } from './meta-parser';
import { cloneDeep } from '../../features/Editor/EditorTree/utils';

export function prepareToSend(data: PreparedMetaData) {
  const clone: PreparedMetaData = cloneDeep(data as PreparedMetaData);
  const stack: Record<
    string,
    {
      path: string[];
      value: string | PreparedMetaData;
    }
  >[] = [];
  Object.entries(clone).forEach(([key, value]) => {
    stack.push({
      [key]: {
        path: [key],
        value,
      },
    });
  });

  while (stack.length > 0) {
    const current = stack.pop();
    if (current) {
      Object.values(current).forEach((value) => {
        if (isObject(value.value)) {
          Object.entries(value.value).forEach(([first, second]) => {
            stack.push({
              [first]: {
                path: [...value.path, first],
                value: second,
              },
            });
          });
        }
      });
    }
  }
  return Object.values(clone)[0];
}
