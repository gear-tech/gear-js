import { parseMeta } from './meta-parser';

import {
  simpleDeepStruct,
  simpleStruct,
  enumSimple,
  optionEnumSimple,
  optionEnumComplex,
  optionEnumNested,
  optionEnumWithFieldsObject,
  resultEnumSimple,
  resultEnumComplex,
  simpleNestedStruct,
  daoMeta,
  enumNested,
  simpleStructResult,
  simpleNestedStructResult,
  simpleDeepStructResult,
  enumSimpleResult,
  enumNestedResult,
  daoMetaResult,
  optionEnumSimpleResult,
  optionEnumWithFieldsObjectResult,
  optionEnumNestedResult,
  optionEnumComplexResult,
  resultEnumSimpleResult,
  resultEnumComplexResult,
} from './meta-fixtures';

describe('meta parser tests', () => {
  // TODO add edge case tests e.g for null, empty array, empty objects

  test('simple struct data parse', () => {
    expect(parseMeta(simpleStruct)).toEqual(simpleStructResult);
  });

  test('nested simple struct data parse', () => {
    expect(parseMeta(simpleNestedStruct)).toEqual(simpleNestedStructResult);
  });

  test('simple deep struct parse', () => {
    expect(parseMeta(simpleDeepStruct)).toEqual(simpleDeepStructResult);
  });

  test('simple enum data parse', () => {
    expect(parseMeta(enumSimple)).toEqual(enumSimpleResult);
  });

  test('nested enum data parse', () => {
    expect(parseMeta(enumNested)).toEqual(enumNestedResult);
  });

  test('dao enum data parse', () => {
    expect(parseMeta(daoMeta)).toEqual(daoMetaResult);
  });

  test('simple option enum data parse', () => {
    expect(parseMeta(optionEnumSimple)).toEqual(optionEnumSimpleResult);
  });

  test('option enum with fields data parse', () => {
    expect(parseMeta(optionEnumWithFieldsObject)).toEqual(optionEnumWithFieldsObjectResult);
  });

  test('option enum nested field data parse', () => {
    expect(parseMeta(optionEnumNested)).toEqual(optionEnumNestedResult);
  });

  test('option enum complex data parse', () => {
    expect(parseMeta(optionEnumComplex)).toEqual(optionEnumComplexResult);
  });

  test('result enum simple data parse', () => {
    expect(parseMeta(resultEnumSimple)).toEqual(resultEnumSimpleResult);
  });

  test('result enum complex data parse', () => {
    expect(parseMeta(resultEnumComplex)).toEqual(resultEnumComplexResult);
  });
});
