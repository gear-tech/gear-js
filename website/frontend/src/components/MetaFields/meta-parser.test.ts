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

describe('test parser', () => {
  // TODO add edge case tests e.g for null, empty array, empty objects

  it('simple struct', () => {
    expect(parseMeta(simpleStruct)).toEqual(simpleStructResult);
  });

  it('nested simple struct', () => {
    expect(parseMeta(simpleNestedStruct)).toEqual(simpleNestedStructResult);
  });

  it('simple deep struct', () => {
    expect(parseMeta(simpleDeepStruct)).toEqual(simpleDeepStructResult);
  });

  it('simple enum', () => {
    expect(parseMeta(enumSimple)).toEqual(enumSimpleResult);
  });

  it('nested enum', () => {
    expect(parseMeta(enumNested)).toEqual(enumNestedResult);
  });

  it('dao enum', () => {
    expect(parseMeta(daoMeta)).toEqual(daoMetaResult);
  });

  it('simple option enum', () => {
    expect(parseMeta(optionEnumSimple)).toEqual(optionEnumSimpleResult);
  });

  it('option enum with fields object', () => {
    expect(parseMeta(optionEnumWithFieldsObject)).toEqual(optionEnumWithFieldsObjectResult);
  });

  it('nested option enum', () => {
    expect(parseMeta(optionEnumNested)).toEqual(optionEnumNestedResult);
  });

  it('with complex option enum', () => {
    expect(parseMeta(optionEnumComplex)).toEqual(optionEnumComplexResult);
  });

  it('with simple result enum', () => {
    expect(parseMeta(resultEnumSimple)).toEqual(resultEnumSimpleResult);
  });

  it('with complex result enum', () => {
    expect(parseMeta(resultEnumComplex)).toEqual(resultEnumComplexResult);
  });
});
