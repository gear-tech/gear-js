import isString from 'lodash.isstring';
import setWith from 'lodash.setwith';
import isObject from 'lodash.isobject';
import { PreparedMetaData } from './meta-parser';

export function prepareToSend(data: PreparedMetaData) {
  const stack: Record<
    string,
    {
      path: string[];
      value: string | PreparedMetaData;
    }
  >[] = [];
  Object.entries(data).forEach(([key, value]) => {
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
      Object.entries(current).forEach((item) => {
        if (isString(item[1].value) && item[1].value === 'Null') {
          setWith(data, item[1].path, null, Object);
        }
        if (isObject(item[1].value)) {
          Object.entries(item[1].value).forEach(([first, second]) => {
            stack.push({
              [first]: {
                path: [...item[1].path, first],
                value: second,
              },
            });
          });
        }
      });
    }
  }
  return data;
}
