import { bracketToDoubleUnderscore, doubleUnderscoreToBracket, replaceAt } from './utils';

describe('replaceAt', () => {
  test('first symbol', () => {
    expect(replaceAt('hello', 0, 'H')).toEqual('Hello');
  });

  test('out of bounds', () => {
    expect(replaceAt('hello', 6, 'asdf')).toEqual('hello');
  });

  test('negative index', () => {
    expect(replaceAt('hello', -1, 'asdf')).toEqual('hello');
  });
});

describe('bracketToDoubleUnderscore', () => {
  test('head and tail brackets', () => {
    expect(bracketToDoubleUnderscore('[u8;4]')).toBe('__u8;4__');
  });

  test('first bracket', () => {
    expect(bracketToDoubleUnderscore('[u8;4')).toBe('__u8;4');
  });

  test('last bracket', () => {
    expect(bracketToDoubleUnderscore('u8;4]')).toBe('u8;4__');
  });

  test('no brackets', () => {
    expect(bracketToDoubleUnderscore('u8;4')).toBe('u8;4');
  });

  test('same direction couple of brackets', () => {
    expect(bracketToDoubleUnderscore('[[u8;4]]')).toBe('[u8;4]');
  });

  test('couple of opposite brackets', () => {
    expect(bracketToDoubleUnderscore('][u8;4][')).toBe('][u8;4][');
  });
});

describe('doubleUnderscoreToBracket', () => {
  test('head and tail double underscores', () => {
    expect(doubleUnderscoreToBracket('__u8;4__')).toBe('[u8;4]');
  });

  test('first double underscore', () => {
    expect(doubleUnderscoreToBracket('__u8;4')).toBe('[u8;4');
  });

  test('last double underscore', () => {
    expect(doubleUnderscoreToBracket('u8;4__')).toBe('u8;4]');
  });

  test('no double underscores', () => {
    expect(doubleUnderscoreToBracket('u8;4')).toBe('u8;4');
  });

  test('more than two underscores', () => {
    expect(doubleUnderscoreToBracket('___u8;4___')).toBe('[_u8;4_]');
  });
});
