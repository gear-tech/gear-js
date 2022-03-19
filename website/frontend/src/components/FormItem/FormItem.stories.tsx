import React, { FC } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormItem } from './FormItem';
import { Form, Formik } from 'formik';
import { MetaItem, parseMeta } from '../../utils/meta-parser';
import {
  simpleStruct,
  simpleNestedStruct,
  simpleDeepStruct,
  enumSimple,
  optionEnumSimple,
  optionEnumWithFieldsObject,
  optionEnumNested,
  optionEnumComplex,
  resultEnumSimple,
  resultEnumComplex,
} from '../../utils/meta-fixtures';

type MetaFormWrapper = {
  metaData: MetaItem;
};

const MetaFormWrapper: FC<MetaFormWrapper> = ({ metaData }) => {
  const meta = parseMeta(metaData);
  return (
    <div style={{ margin: '0 auto', maxWidth: '600px' }}>
      <Formik
        initialValues={{
          meta: null,
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        <Form>
          {meta && <FormItem data={meta} />}
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default {
  title: 'FORM/Meta form',
  component: FormItem,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof MetaFormWrapper>;

const Template: ComponentStory<typeof MetaFormWrapper> = (args) => {
  return <MetaFormWrapper metaData={args.metaData} />;
};

export const SimpleStruct = Template.bind({});
SimpleStruct.args = { metaData: simpleStruct };

export const SimpleNestedStruct = Template.bind({});
SimpleNestedStruct.args = { metaData: simpleNestedStruct };

export const SimpleDeepStruct = Template.bind({});
SimpleDeepStruct.args = { metaData: simpleDeepStruct };

export const EnumSimpleStruct = Template.bind({});
EnumSimpleStruct.args = { metaData: enumSimple };

export const OptionEnumSimpleStruct = Template.bind({});
OptionEnumSimpleStruct.args = { metaData: optionEnumSimple };

export const OptionEnumWithFieldsStruct = Template.bind({});
OptionEnumWithFieldsStruct.args = { metaData: optionEnumWithFieldsObject };

export const OptionEnumNestedStruct = Template.bind({});
OptionEnumNestedStruct.args = { metaData: optionEnumNested };

export const OptionEnumComplexStruct = Template.bind({});
OptionEnumComplexStruct.args = { metaData: optionEnumComplex };

export const ResultEnumSimpleStruct = Template.bind({});
ResultEnumSimpleStruct.args = { metaData: resultEnumSimple };

export const ResultEnumComplexStruct = Template.bind({});
ResultEnumComplexStruct.args = { metaData: resultEnumComplex };
