import React, { FC } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MetaFields } from './MetaFields';
import { Form, Formik } from 'formik';
import { MetaFieldsStruct, MetaItem, parseMeta, PreparedMetaData } from './new-meta-parser';
import { prepareToSend } from './prepare-to-send';
import {
  StructSet as _StructSet,
  StructField as _StructField,
  Primitive as _Primitive,
  BTreeMap as _BTreeMap,
  BTreeSet as _BTreeSet,
  Enum as _Enum,
  Option as _Option,
  VecField as _Vec,
  Result as _Result,
  Tuple as _Tuple,
  Array as _Array,
  FungibleTokenAction as _FungibleTokenAction,
  ResultComplex as _ComplexResult,
  NFT as _NFT,
  VecSet as _VecNew,
} from './new-meta-fixtures';

type MetaFormWrapper = {
  metaData: MetaItem;
  children: (meta: MetaFieldsStruct) => React.ReactNode;
  onSubmit: (values: PreparedMetaData) => void;
};

export const MetaFormWrapper: FC<MetaFormWrapper> = ({ metaData, children, onSubmit }) => {
  const meta = parseMeta(metaData);
  return (
    <div style={{ margin: '0 auto', maxWidth: '600px' }}>
      <Formik
        initialValues={{
          __root: null,
        }}
        onSubmit={(values) => {
          const prepared = prepareToSend(values.__root!) as PreparedMetaData;
          onSubmit(prepared);
        }}
      >
        <Form>
          {meta && children(meta)}
          <button role={'button'} type="submit">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default {
  title: 'FORM/New meta form',
  component: MetaFields,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MetaFormWrapper>;

const NewTemplate: ComponentStory<typeof MetaFormWrapper> = (args) => {
  return (
    <MetaFormWrapper onSubmit={console.log} metaData={args.metaData}>
      {(meta) => <MetaFields data={meta} />}
    </MetaFormWrapper>
  );
};

export const StructSet = NewTemplate.bind({});
StructSet.args = { metaData: _StructSet };

export const StructField = NewTemplate.bind({});
StructField.args = { metaData: _StructField };

export const Primitive = NewTemplate.bind({});
Primitive.args = { metaData: _Primitive };

export const BTreeMap = NewTemplate.bind({});
BTreeMap.args = { metaData: _BTreeMap };

export const BTreeSet = NewTemplate.bind({});
BTreeSet.args = { metaData: _BTreeSet };

export const Enum = NewTemplate.bind({});
Enum.args = { metaData: _Enum };

export const Option = NewTemplate.bind({});
Option.args = { metaData: _Option };

export const Vec = NewTemplate.bind({});
Vec.args = { metaData: _Vec };

export const Result = NewTemplate.bind({});
Result.args = { metaData: _Result };

export const Tuple = NewTemplate.bind({});
Tuple.args = { metaData: _Tuple };

export const Array = NewTemplate.bind({});
Array.args = { metaData: _Array };

export const FungibleTokenAction = NewTemplate.bind({});
FungibleTokenAction.args = { metaData: _FungibleTokenAction };

export const ComplexResult = NewTemplate.bind({});
ComplexResult.args = { metaData: _ComplexResult };

export const NFT = NewTemplate.bind({});
NFT.args = { metaData: _NFT };

export const VecNew = NewTemplate.bind({});
VecNew.args = { metaData: _VecNew };
