import isObject from 'lodash.isobject';
import setWith from 'lodash.setwith';

type FormStruct = {
  [key: string]: null | string | FormStruct;
};

export function findReplaceNull(struct: FormStruct | null) {
  let nilledStruct = null;
  if (!struct) {
    return nilledStruct;
  }

  const stack = [
    ...Object.entries(struct).map((item) => ({
      path: item[0],
      value: item[1],
    })),
  ];

  while (stack.length > 0) {
    const current = stack.pop();

    if (current) {
      if (current.value && isObject(current.value)) {
        stack.push(
          ...Object.entries(current.value).map((item) => ({
            path: [current.path, item[0]].join('.'),
            value: item[1],
          }))
        );
      } else {
        if (!nilledStruct) {
          nilledStruct = {};
        }
        setWith(nilledStruct, current.path, current.value === 'Null' ? null : current.value, Object);
      }
    }
  }

  return nilledStruct;
}
