import React, { FC } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MetaFields } from './MetaFields';
import { Form, Formik, FormikValues } from 'formik';
import { MetaFieldsStruct, MetaFieldsValues, MetaItem, parseMeta } from './new-meta-parser';
import { prepareToSend } from './prepare-to-send';
import {
  Struct as _Struct,
  Primitive as _Primitive,
  BTreeMap as _BTreeMap,
  BTreeSet as _BTreeSet,
  Enum as _Enum,
  Option as _Option,
  Vec as _Vec,
  Result as _Result,
  Tuple as _Tuple,
  Array as _Array,
  FungibleTokenAction as _FungibleTokenAction,
} from './new-meta-fixtures';

type MetaFormWrapper = {
  metaData: MetaItem;
  children: (meta: MetaFieldsStruct) => React.ReactNode;
  onSubmit: (values: FormikValues) => void;
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
          onSubmit(values);
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

export const NewMetaFormWrapper: FC<MetaFormWrapper> = ({ metaData, children, onSubmit }) => {
  const meta = parseMeta(metaData);
  return (
    <div style={{ margin: '0 auto', maxWidth: '600px' }}>
      <Formik
        initialValues={{
          __root: null,
        }}
        onSubmit={(values) => {
          onSubmit(values);
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
  title: 'FORM/Meta form',
  component: MetaFields,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MetaFormWrapper>;

const NewTemplate: ComponentStory<typeof MetaFormWrapper> = (args) => {
  return (
    <MetaFormWrapper
      onSubmit={(values) => {
        const copy: MetaFieldsValues = JSON.parse(JSON.stringify(values));
        console.log(prepareToSend(copy));
      }}
      metaData={args.metaData}
    >
      {/* @ts-ignore */}
      {(meta) => <MetaFields data={meta} />}
    </MetaFormWrapper>
  );
};

export const Struct = NewTemplate.bind({});
Struct.args = { metaData: _Struct };

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
