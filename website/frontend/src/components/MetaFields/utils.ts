export function replaceAt(str: string, index: number, value: string) {
  if (index > str.length) {
    return str;
  }
  const arr = str.split('');
  arr[index] = value;
  return arr.join('');
}

export function bracketToDoubleUnderscore(key: string) {
  if (key[0] === '[') {
    key = replaceAt(key, 0, '__');
  }
  const lastIndex = key.length - 1;
  if (key[lastIndex] === ']') {
    key = replaceAt(key, lastIndex, '__');
  }
  return key;
}

export function doubleUnderscoreToBracket(key: string) {
  if (key[0] === '_' && key[1] === '_') {
    key = replaceAt(key, 0, '[');
    key = replaceAt(key, 1, '');
  }
  const lastIndex = key.length - 1;
  if (key[lastIndex] === '_' && key[lastIndex - 1] === '_') {
    key = replaceAt(key, lastIndex, '');
    key = replaceAt(key, lastIndex - 1, ']');
  }
  return key;
}
