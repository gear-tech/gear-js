import React, { FC } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MetaFields } from './MetaFields';
import { Form, Formik } from 'formik';
import { MetaFormValues, MetaItem, parseMeta, prepareToSend } from '../../utils/meta-parser';
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
  daoMeta,
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
          __root: null,
        }}
        onSubmit={(values) => {
          const copy: MetaFormValues = JSON.parse(JSON.stringify(values));
          console.log(prepareToSend(copy));
        }}
      >
        <Form>
          {meta && <MetaFields data={meta} />}
          <button type="submit">Submit</button>
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

export const DaoStruct = Template.bind({});
DaoStruct.args = { metaData: daoMeta };
