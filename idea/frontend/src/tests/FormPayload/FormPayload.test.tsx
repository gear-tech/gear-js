import { Formik, Form } from 'formik';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';

import { FormValues, TestFormProps } from './types';
import { INPUT_PAYLOAD_VALUES, INPUT_MANUAL_PAYLOAD, INIT_FORM_VALUES, INPUT_FILE_CONTENT } from './inputData';

import { FILE_TYPES } from 'consts';
import { getPreformattedText } from 'helpers';
import { AlertProvider } from 'context/alert';
import { FormPayload } from 'components/common/Form/FormPayload';

const TestFormPayload = ({ values, onSubmit }: TestFormProps) => (
  <AlertProvider>
    <Formik initialValues={INIT_FORM_VALUES} onSubmit={onSubmit}>
      <Form data-testid="test-form">
        <FormPayload name="payload" label="Test payload" values={values} />
      </Form>
    </Formik>
  </AlertProvider>
);

describe('form payload tests', () => {
  const submitCallbackMock = jest.fn();

  const submit = () => {
    submitCallbackMock.mockReset();
    fireEvent.submit(screen.getByTestId('test-form'));
  };

  const changeFieldValue = (element: Element | Node, value: string) => {
    fireEvent.change(element, { target: { value } });
  };

  const toggleView = () => {
    fireEvent.click(screen.getByRole('checkbox'));
  };

  const verifyValues = (formValues: FormValues) => waitFor(() => expect(submitCallbackMock).toBeCalledWith(formValues));

  it('renders form without metadata', () => {
    const { rerender } = render(<TestFormPayload onSubmit={jest.fn()} />);

    const manualTextarea = screen.getByPlaceholderText('// Enter your payload here');

    expect(screen.getByLabelText('Test payload')).toBeInTheDocument();
    expect(screen.queryByLabelText('Manual input')).toBeNull();
    expect(manualTextarea).toBeInTheDocument();
    expect(manualTextarea).toHaveTextContent('');
    expect(screen.queryByText('Select file')).toBeNull();

    rerender(<TestFormPayload values={INPUT_PAYLOAD_VALUES} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText('Manual input')).toBeInTheDocument();

    expect(manualTextarea).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.queryByText('Select file')).toBeNull();

    expect(screen.getAllByRole('group')).toHaveLength(2);
    expect(screen.getAllByRole('combobox')).toHaveLength(2);

    toggleView();

    expect(screen.getByText('Select file')).toBeInTheDocument();
  });

  it('submits manual payload', async () => {
    render(
      <TestFormPayload
        values={INPUT_PAYLOAD_VALUES}
        onSubmit={jest.fn((values: FormValues) => submitCallbackMock(values))}
      />
    );

    toggleView();

    const manualTextbox = screen.getByRole('textbox');

    expect(screen.getByLabelText('Test payload')).toBeInTheDocument();
    expect(manualTextbox).toHaveValue(getPreformattedText(INPUT_MANUAL_PAYLOAD));

    const manualText = `
    {
      "Option": {
          "firstName": "first",
          "secondName": "second",
          "age": null,
      }
    }`;

    changeFieldValue(manualTextbox, manualText);

    expect(manualTextbox).toHaveValue(manualText);

    submit();
    await verifyValues({ payload: manualText });
  });

  it('should set form value from json', async () => {
    render(
      <TestFormPayload
        values={INPUT_PAYLOAD_VALUES}
        onSubmit={jest.fn((values: FormValues) => submitCallbackMock(values))}
      />
    );

    toggleView();

    const textbox = screen.getByRole('textbox');

    const fileInput = screen.getByTestId('payloadFileInput');

    expect(fileInput).toBeInTheDocument();
    expect(screen.getByText('Select file')).toBeInTheDocument();

    // upload file

    const testFile = new File([INPUT_FILE_CONTENT], 'test.json', { type: FILE_TYPES.JSON });

    fireEvent.change(fileInput, {
      target: { files: [testFile] },
    });

    await waitFor(() => expect(screen.queryByText('Select file')).toBeNull());

    expect(screen.getByText('test.json')).toBeInTheDocument();

    await waitFor(() => expect(textbox).toHaveValue(INPUT_FILE_CONTENT));

    submit();
    await verifyValues({ payload: INPUT_FILE_CONTENT });

    // remove file

    fireEvent.change(fileInput, {
      target: { files: null },
    });

    await waitFor(() => expect(screen.getByText('Select file')).toBeInTheDocument());

    await waitFor(() => expect(textbox).toHaveValue(getPreformattedText(INPUT_MANUAL_PAYLOAD)));

    submit();
    await verifyValues({ payload: getPreformattedText(INPUT_MANUAL_PAYLOAD) });
  });

  it('renders form with metadata', () => {
    render(<TestFormPayload values={INPUT_PAYLOAD_VALUES} onSubmit={jest.fn()} />);

    let fieldsets = screen.getAllByRole('group');
    let selectors: HTMLSelectElement[] = screen.getAllByRole('combobox');

    const changeSelectValue = (element: Element | Node, value: string) => {
      changeFieldValue(element, value);

      fieldsets = screen.getAllByRole('group');
      selectors = screen.getAllByRole('combobox');
    };

    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.queryByPlaceholderText('// Enter your payload here')).toBeNull();

    expect(within(fieldsets[0]).getByText('Action')).toBeInTheDocument();
    expect(selectors[0]).toHaveValue('Option');

    expect(screen.getByText('Test payload')).toBeInTheDocument();

    // Option
    expect(fieldsets).toHaveLength(2);
    expect(selectors).toHaveLength(2);

    expect(within(fieldsets[1]).getByText('Option<Person>')).toBeInTheDocument();
    expect(selectors[1]).toHaveValue('none');

    changeSelectValue(selectors[1], 'some');

    expect(selectors[1]).toHaveValue('some');

    expect(selectors).toHaveLength(3);
    expect(fieldsets).toHaveLength(4);

    expect(within(fieldsets[2]).getByText('Person')).toBeInTheDocument();
    expect(within(fieldsets[2]).getByLabelText('firstName (Text)')).toHaveValue('');
    expect(within(fieldsets[2]).getByLabelText('firstName (Text)')).toBeInTheDocument();
    expect(within(fieldsets[2]).getByLabelText('secondName (Text)')).toHaveValue('');
    expect(within(fieldsets[2]).getByLabelText('secondName (Text)')).toBeInTheDocument();

    expect(within(fieldsets[3]).getByText('age (Option<i8>)')).toBeInTheDocument();
    expect(within(fieldsets[3]).queryByLabelText('i8')).toBeNull();

    expect(selectors[2]).toHaveValue('none');

    changeSelectValue(selectors[2], 'some');

    expect(selectors[2]).toHaveValue('some');
    expect(within(fieldsets[3]).getByLabelText('i8')).toHaveValue('');
    expect(within(fieldsets[3]).getByLabelText('i8')).toBeInTheDocument();

    // Result
    changeSelectValue(selectors[0], 'Result');

    expect(selectors[0]).toHaveValue('Result');

    expect(selectors).toHaveLength(2);
    expect(fieldsets).toHaveLength(2);

    expect(selectors[1]).toHaveValue('ok');

    expect(within(fieldsets[1]).getByText('Result<Text, i32>')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('Text')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('Text')).toHaveValue('');
    expect(within(fieldsets[1]).queryByLabelText('i32')).toBeNull();

    changeSelectValue(selectors[1], 'err');

    expect(selectors[1]).toHaveValue('err');

    expect(within(fieldsets[1]).queryByLabelText('Text')).toBeNull();
    expect(within(fieldsets[1]).getByLabelText('i32')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('i32')).toHaveValue('');

    // Null
    changeSelectValue(selectors[0], 'Null');

    expect(selectors[0]).toHaveValue('Null');

    expect(selectors).toHaveLength(1);
    expect(fieldsets).toHaveLength(1);

    expect(within(fieldsets[0]).queryByRole('textbox')).not.toBeInTheDocument();

    // Vec
    changeSelectValue(selectors[0], 'Vec');

    expect(selectors[0]).toHaveValue('Vec');

    expect(selectors).toHaveLength(1);
    expect(fieldsets).toHaveLength(1);

    expect(within(fieldsets[0]).getByText('Vec<Person>')).toBeInTheDocument();
    expect(within(fieldsets[0]).getByRole('textbox')).toHaveValue(
      getPreformattedText([{ firstName: '', secondName: '', age: null }])
    );

    // Struct
    changeSelectValue(selectors[0], 'Struct');

    expect(selectors[0]).toHaveValue('Struct');

    expect(selectors).toHaveLength(2);
    expect(fieldsets).toHaveLength(3);

    expect(within(fieldsets[1]).getByText('Person')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('firstName (Text)')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('firstName (Text)')).toHaveValue('');
    expect(within(fieldsets[1]).getByLabelText('secondName (Text)')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('secondName (Text)')).toHaveValue('');

    expect(within(fieldsets[2]).getByText('age (Option<i8>)')).toBeInTheDocument();
    expect(within(fieldsets[2]).queryByLabelText('i8')).toBeNull();

    expect(selectors[1]).toHaveValue('none');

    changeSelectValue(selectors[1], 'some');

    expect(selectors[1]).toHaveValue('some');

    expect(within(fieldsets[2]).getByLabelText('i8')).toBeInTheDocument();
    expect(within(fieldsets[2]).getByLabelText('i8')).toHaveValue('');

    // Tuple
    changeSelectValue(selectors[0], 'Tuple');

    expect(selectors[0]).toHaveValue('Tuple');

    expect(selectors).toHaveLength(1);
    expect(fieldsets).toHaveLength(2);

    expect(within(fieldsets[1]).getByText('(ActorId,Text)')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('ActorId')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('ActorId')).toHaveValue('');
    expect(within(fieldsets[1]).getByLabelText('Text')).toBeInTheDocument();
    expect(within(fieldsets[1]).getByLabelText('Text')).toHaveValue('');

    // Array
    changeSelectValue(selectors[0], 'Array');

    expect(selectors[0]).toHaveValue('Array');

    expect(selectors).toHaveLength(1);
    expect(fieldsets).toHaveLength(2);

    expect(within(fieldsets[1]).getByText('[u16;4]')).toBeInTheDocument();

    const arrayFields = within(fieldsets[1]).getAllByLabelText('u16');

    expect(arrayFields).toHaveLength(4);
    arrayFields.forEach((field) => expect(field).toHaveValue(''));

    // BTreeMap
    changeSelectValue(selectors[0], 'BTreeMap');

    expect(selectors[0]).toHaveValue('BTreeMap');

    expect(selectors).toHaveLength(1);
    expect(fieldsets).toHaveLength(1);

    expect(within(fieldsets[0]).getByText('BTreeMap<Text, u128>')).toBeInTheDocument();
    expect(within(fieldsets[0]).getByRole('textbox')).toHaveValue('{ }');

    // BTreeSet
    changeSelectValue(selectors[0], 'BTreeSet');

    expect(selectors[0]).toHaveValue('BTreeSet');

    expect(selectors).toHaveLength(1);
    expect(fieldsets).toHaveLength(1);

    expect(within(fieldsets[0]).getByText('BTreeSet<u8>')).toBeInTheDocument();
    expect(within(fieldsets[0]).getByRole('textbox')).toHaveValue('[ ]');
  });

  it('submits payload', async () => {
    render(
      <TestFormPayload
        values={INPUT_PAYLOAD_VALUES}
        onSubmit={jest.fn((values: FormValues) => submitCallbackMock(values))}
      />
    );

    let fieldsets = screen.getAllByRole('group');
    let selectors = screen.getAllByRole('combobox');

    const changeValue = (element: Element | Node, value: string) => {
      changeFieldValue(element, value);

      fieldsets = screen.getAllByRole('group');
      selectors = screen.getAllByRole('combobox');
    };

    // Option
    submit();
    await verifyValues({ payload: { Option: null } });

    changeValue(selectors[1], 'some');

    changeValue(within(fieldsets[2]).getByLabelText('firstName (Text)'), 'First name');
    changeValue(within(fieldsets[2]).getByLabelText('secondName (Text)'), 'Second name');

    expect(within(fieldsets[2]).getByLabelText('firstName (Text)')).toHaveValue('First name');
    expect(within(fieldsets[2]).getByLabelText('secondName (Text)')).toHaveValue('Second name');

    submit();
    await verifyValues({
      payload: {
        Option: {
          age: null,
          firstName: 'First name',
          secondName: 'Second name',
        },
      },
    });

    changeValue(selectors[2], 'some');
    changeValue(within(fieldsets[3]).getByLabelText('i8'), '1');

    expect(within(fieldsets[3]).getByLabelText('i8')).toHaveValue('1');

    submit();
    await verifyValues({
      payload: {
        Option: {
          age: '1',
          firstName: 'First name',
          secondName: 'Second name',
        },
      },
    });

    // Result
    changeValue(selectors[0], 'Result');

    submit();
    await verifyValues({ payload: { Result: { ok: '' } } });

    changeValue(within(fieldsets[1]).getByLabelText('Text'), 'test');

    expect(within(fieldsets[1]).getByLabelText('Text')).toHaveValue('test');

    submit();
    await verifyValues({ payload: { Result: { ok: 'test' } } });

    changeValue(selectors[1], 'err');

    submit();
    await verifyValues({ payload: { Result: { err: '' } } });

    changeValue(within(fieldsets[1]).getByLabelText('i32'), '1');

    expect(within(fieldsets[1]).getByLabelText('i32')).toHaveValue('1');

    submit();
    await verifyValues({ payload: { Result: { err: '1' } } });

    // Null

    changeValue(selectors[0], 'Null');

    submit();
    await verifyValues({
      payload: {
        Null: null,
      },
    });

    // Vec
    changeValue(selectors[0], 'Vec');

    submit();
    await verifyValues({
      payload: {
        Vec: getPreformattedText([{ firstName: '', secondName: '', age: null }]),
      },
    });

    // Struct
    changeValue(selectors[0], 'Struct');

    submit();
    await verifyValues({ payload: { Struct: { firstName: '', secondName: '', age: null } } });

    changeValue(within(fieldsets[1]).getByLabelText('firstName (Text)'), 'first');
    changeValue(within(fieldsets[1]).getByLabelText('secondName (Text)'), 'second');

    expect(within(fieldsets[1]).getByLabelText('firstName (Text)')).toHaveValue('first');
    expect(within(fieldsets[1]).getByLabelText('secondName (Text)')).toHaveValue('second');

    submit();
    await verifyValues({ payload: { Struct: { firstName: 'first', secondName: 'second', age: null } } });

    changeValue(selectors[1], 'some');

    submit();
    await verifyValues({ payload: { Struct: { firstName: 'first', secondName: 'second', age: '' } } });

    changeValue(within(fieldsets[2]).getByLabelText('i8'), 'i8');

    expect(within(fieldsets[2]).getByLabelText('i8')).toHaveValue('i8');

    submit();
    await verifyValues({ payload: { Struct: { firstName: 'first', secondName: 'second', age: 'i8' } } });

    // Tuple
    changeValue(selectors[0], 'Tuple');

    submit();
    await verifyValues({ payload: { Tuple: ['', ''] } });

    changeValue(within(fieldsets[1]).getByLabelText('ActorId'), '1');
    changeValue(within(fieldsets[1]).getByLabelText('Text'), 'text');

    expect(within(fieldsets[1]).getByLabelText('ActorId')).toHaveValue('1');
    expect(within(fieldsets[1]).getByLabelText('Text')).toHaveValue('text');

    submit();
    await verifyValues({ payload: { Tuple: ['1', 'text'] } });

    // Array
    changeValue(selectors[0], 'Array');

    submit();
    await verifyValues({ payload: { Array: ['', '', '', ''] } });

    const fields = within(fieldsets[1]).getAllByLabelText('u16');

    changeValue(fields[0], '1');
    changeValue(fields[1], '2');
    changeValue(fields[2], '3');
    changeValue(fields[3], '4');

    expect(fields[1]).toHaveValue('2');
    expect(fields[2]).toHaveValue('3');
    expect(fields[3]).toHaveValue('4');

    submit();
    await verifyValues({ payload: { Array: ['1', '2', '3', '4'] } });

    // BTreeMap
    changeValue(selectors[0], 'BTreeMap');

    submit();
    await verifyValues({ payload: { BTreeMap: '{ }' } });

    changeValue(within(fieldsets[0]).getByRole('textbox'), '{ "text": "2" }');

    expect(within(fieldsets[0]).getByRole('textbox')).toHaveValue('{ "text": "2" }');

    submit();
    await verifyValues({ payload: { BTreeMap: '{ "text": "2" }' } });

    // BTreeSet
    changeValue(selectors[0], 'BTreeSet');

    submit();
    await verifyValues({ payload: { BTreeSet: '[ ]' } });

    changeValue(within(fieldsets[0]).getByRole('textbox'), '[ 1 ]');

    expect(within(fieldsets[0]).getByRole('textbox')).toHaveValue('[ 1 ]');

    submit();
    await verifyValues({ payload: { BTreeSet: '[ 1 ]' } });
  });
});
