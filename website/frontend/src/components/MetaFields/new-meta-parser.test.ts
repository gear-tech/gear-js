import { parseMeta } from './new-meta-parser';
import {
  Primitive,
  PrimitiveResult,
  BTreeMap,
  BTreeMapResult,
  BTreeSet,
  BTreeSetResult,
  StructSet,
  StructSetResult,
  Enum,
  EnumResult,
  Option,
  OptionResult,
  Vec,
  VecResult,
  Result,
  ResultResult,
  Tuple,
  TupleResult,
  Array,
  ArrayResult,
  FungibleTokenAction,
  FungibleTokenActionResult,
  StructField,
  StructFieldResult,
  ComplexResultResult,
  ComplexResult,
} from './new-meta-fixtures';

describe('meta parser tests', () => {
  // TODO add edge case tests e.g for null, empty array, empty objects

  test('Primitive', () => {
    expect(parseMeta(Primitive)).toEqual(PrimitiveResult);
  });

  test('Struct set', () => {
    expect(parseMeta(StructSet)).toEqual(StructSetResult);
  });

  test('Struct field', () => {
    expect(parseMeta(StructField)).toEqual(StructFieldResult);
  });

  test('BTreeMap', () => {
    expect(parseMeta(BTreeMap)).toEqual(BTreeMapResult);
  });

  test('BTreeSet', () => {
    expect(parseMeta(BTreeSet)).toEqual(BTreeSetResult);
  });

  test('Enum', () => {
    expect(parseMeta(Enum)).toEqual(EnumResult);
  });

  test('Option', () => {
    expect(parseMeta(Option)).toEqual(OptionResult);
  });

  test('Vec', () => {
    expect(parseMeta(Vec)).toEqual(VecResult);
  });

  test('Result', () => {
    expect(parseMeta(Result)).toEqual(ResultResult);
  });

  test('Tuple', () => {
    expect(parseMeta(Tuple)).toEqual(TupleResult);
  });

  test('Array', () => {
    expect(parseMeta(Array)).toEqual(ArrayResult);
  });

  test('FungibleTokenAction', () => {
    expect(parseMeta(FungibleTokenAction)).toEqual(FungibleTokenActionResult);
  });

  test('Complex Result', () => {
    expect(parseMeta(ComplexResult)).toEqual(ComplexResultResult);
  });
});
