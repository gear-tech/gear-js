import { decodeHexTypes, createPayloadTypeStructure, Metadata } from '@gear-js/api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';

import { PROGRAM, PROGRAM_ID, MESSAGE_ID, PROGRAM_WITH_META } from './inputData';
import { TEST_ACCOUNT, TEST_API } from '../../const';
import { useProgramMock, useAccountMock, useApiMock } from '../../mocks/hooks';

import * as helpers from 'helpers';
import * as ApiService from 'services/ApiService';
import { AlertProvider, ApiProvider, AccountProvider } from 'context';
import { ProgramModel } from 'types/program';
import { Send } from 'components/pages/Send/Send';
import { FormValues } from 'components/pages/Send/children/MessageForm/types';
import { TypeStructure } from 'components/common/Form/FormPayload/types';
import { getSubmitPayload, getPayloadValue } from 'components/common/Form/FormPayload/helpers';

type Props = {
  path: string;
  initialEntries: string[];
};

const SendMessagePage = ({ path, initialEntries }: Props) => (
  <ApiProvider>
    <AccountProvider>
      <AlertProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={path} element={<Send />} />
          </Routes>
        </MemoryRouter>
      </AlertProvider>
    </AccountProvider>
  </ApiProvider>
);

jest.mock('services/MessagesRequestServices', () => ({
  messagesService: {
    fetchMessage: () =>
      Promise.resolve({
        result: {
          source: '0x52970eb8531778ac816303e806c694caf65579dfad5fafa31c2b7b0f61dfd6f2',
          replyError: 'replyError',
        },
      }),
  },
}));

describe('send message page tests', () => {
  const submit = (element: Element) => {
    fireEvent.submit(element);
  };

  const changeFieldValue = (element: Element | Node, value: string) => {
    fireEvent.change(element, { target: { value } });
  };

  it('should show loader', () => {
    useProgramMock();

    render(<SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID}`]} />);

    expect(screen.queryByRole('form')).toBeNull();
    expect(screen.queryByText('New message')).toBeNull();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('test send message form without meta', async () => {
    useApiMock(TEST_API);
    const mockProgram = useProgramMock(PROGRAM);

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);
    const sendMessageMock = jest.spyOn(ApiService, 'sendMessage').mockResolvedValue();

    const { rerender } = render(
      <SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID}`]} />
    );

    expect(mockProgram).toBeCalledWith(PROGRAM_ID);

    // header test

    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('New message')).toBeInTheDocument();

    // checking if fields are present in a form

    const valueField = screen.getByLabelText('Value');
    const payloadField = screen.getByLabelText('Payload');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const destinationField = screen.getByLabelText('Destination');
    const payloadTypeField = screen.getByLabelText('Payload type');
    const payloadTypeSwitch = screen.getByLabelText('Enter type');

    const sendMessageBtn = screen.getByText('Send message');
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(payloadField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();
    expect(destinationField).toBeInTheDocument();

    expect(payloadTypeField).toBeDisabled();
    expect(payloadTypeField).toBeInTheDocument();
    expect(payloadTypeField).toHaveValue('Bytes');

    expect(payloadTypeSwitch).toBeInTheDocument();

    expect(sendMessageBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // unauthorized submit

    submit(sendMessageBtn);

    await waitFor(() => expect(screen.getByText('WALLET NOT CONNECTED')).toBeInTheDocument());

    useAccountMock(TEST_ACCOUNT);

    rerender(<SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID}`]} />);

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(payloadField, '0x00');
    expect(payloadField).toHaveValue('0x00');

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    changeFieldValue(destinationField, 'program');
    expect(destinationField).toHaveValue('program');

    fireEvent.click(payloadTypeSwitch);

    expect(payloadTypeField).not.toBeDisabled();

    changeFieldValue(payloadTypeField, 'u32');
    expect(payloadTypeField).toHaveValue('u32');

    const formValues: FormValues = {
      value: 1000,
      payload: '0x00',
      gasLimit: 30000000,
      payloadType: 'u32',
      destination: 'program',
    };

    // calculate gas

    fireEvent.click(calculateGasBtn);

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith(
      'handle',
      TEST_API,
      formValues,
      expect.any(Object),
      undefined,
      null,
      PROGRAM_ID,
      undefined
    );

    // authorized submit

    submit(sendMessageBtn);

    const message = {
      value: formValues.value.toString(),
      payload: getSubmitPayload(formValues.payload),
      gasLimit: '2400000',
      replyToId: formValues.destination,
      destination: formValues.destination,
    };

    await waitFor(() => {
      expect(sendMessageMock).toBeCalledTimes(1);
      expect(sendMessageMock).toBeCalledWith(
        TEST_API.message,
        TEST_ACCOUNT,
        message,
        expect.any(Object),
        expect.any(Function),
        undefined,
        'u32'
      );
    });
  });

  it('test send message form with meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT);
    const mockProgram = useProgramMock(PROGRAM_WITH_META);

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);
    const sendMessageMock = jest.spyOn(ApiService, 'sendMessage').mockResolvedValue();

    render(<SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID}`]} />);

    expect(mockProgram).toBeCalledWith(PROGRAM_ID);

    // checking if fields are present in a form

    const valueField = screen.getByLabelText('Value');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const destinationField = screen.getByLabelText('Destination');
    const payloadTypeField = screen.queryByLabelText('Payload type');
    const payloadTypeSwitch = screen.queryByLabelText('Enter type');

    const sendMessageBtn = screen.getByText('Send message');
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();
    expect(destinationField).toBeInTheDocument();

    expect(payloadTypeField).toBeNull();
    expect(payloadTypeSwitch).toBeNull();

    expect(sendMessageBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    changeFieldValue(destinationField, 'program');
    expect(destinationField).toHaveValue('program');

    const [, meta] = mockProgram.mock.results[0].value as [ProgramModel, Metadata];
    const decodedTypes = decodeHexTypes(meta.types!);
    const typeStructure = createPayloadTypeStructure(meta.handle_input!, decodedTypes) as TypeStructure;

    const formValues: FormValues = {
      value: 1000,
      payload: getPayloadValue(typeStructure),
      gasLimit: 30000000,
      payloadType: 'Bytes',
      destination: 'program',
    };

    // calculate gas

    fireEvent.click(calculateGasBtn);

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith(
      'handle',
      TEST_API,
      formValues,
      expect.any(Object),
      meta,
      null,
      PROGRAM_ID,
      undefined
    );

    // authorized submit

    submit(sendMessageBtn);

    const message = {
      value: formValues.value.toString(),
      payload: getSubmitPayload(formValues.payload),
      gasLimit: '2400000',
      replyToId: formValues.destination,
      destination: formValues.destination,
    };

    await waitFor(() => {
      expect(sendMessageMock).toBeCalledTimes(1);
      expect(sendMessageMock).toBeCalledWith(
        TEST_API.message,
        TEST_ACCOUNT,
        message,
        expect.any(Object),
        expect.any(Function),
        meta,
        undefined
      );
    });
  });

  it('test send reply form without meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT);
    const mockProgram = useProgramMock(PROGRAM);

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);
    const sendMessageMock = jest.spyOn(ApiService, 'sendMessage').mockResolvedValue();

    render(<SendMessagePage path="/send/reply/:messageId" initialEntries={[`/send/reply/${MESSAGE_ID}`]} />);

    await waitFor(() => expect(mockProgram).toBeCalledWith(PROGRAM_ID));

    // header test

    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getAllByText('Send reply')).toHaveLength(2);

    // checking if fields are present in a form

    const valueField = screen.getByLabelText('Value');
    const payloadField = screen.getByLabelText('Payload');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const messageIdField = screen.getByLabelText('Message Id');
    const payloadTypeField = screen.getByLabelText('Payload type');
    const payloadTypeSwitch = screen.getByLabelText('Enter type');

    const sendReplyBtn = screen.getAllByText('Send reply')[1];
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(payloadField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();
    expect(messageIdField).toBeInTheDocument();

    expect(payloadTypeField).toBeDisabled();
    expect(payloadTypeField).toBeInTheDocument();
    expect(payloadTypeField).toHaveValue('Bytes');

    expect(payloadTypeSwitch).toBeInTheDocument();

    expect(sendReplyBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(payloadField, '0x00');
    expect(payloadField).toHaveValue('0x00');

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    fireEvent.click(payloadTypeSwitch);

    expect(payloadTypeField).not.toBeDisabled();

    changeFieldValue(payloadTypeField, 'u32');
    expect(payloadTypeField).toHaveValue('u32');

    const formValues: FormValues = {
      value: 1000,
      payload: '0x00',
      gasLimit: 30000000,
      payloadType: 'u32',
      destination: MESSAGE_ID,
    };

    // calculate gas

    fireEvent.click(calculateGasBtn);

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith(
      'reply',
      TEST_API,
      formValues,
      expect.any(Object),
      undefined,
      null,
      MESSAGE_ID,
      'replyError'
    );

    // authorized submit

    submit(sendReplyBtn);

    const message = {
      value: formValues.value.toString(),
      payload: getSubmitPayload(formValues.payload),
      gasLimit: '2400000',
      replyToId: formValues.destination,
      destination: formValues.destination,
    };

    await waitFor(() => {
      expect(sendMessageMock).toBeCalledTimes(1);
      expect(sendMessageMock).toBeCalledWith(
        TEST_API.reply,
        TEST_ACCOUNT,
        message,
        expect.any(Object),
        expect.any(Function),
        undefined,
        'u32'
      );
    });
  });

  it('test reply message form with meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT);
    const mockProgram = useProgramMock(PROGRAM_WITH_META);

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);
    const sendMessageMock = jest.spyOn(ApiService, 'sendMessage').mockResolvedValue();

    render(<SendMessagePage path="/reply/message/:messageId" initialEntries={[`/reply/message/${MESSAGE_ID}`]} />);

    await waitFor(() => expect(mockProgram).toBeCalledWith(PROGRAM_ID));

    // checking if fields are present in a form

    const valueField = screen.getByLabelText('Value');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const messageIdField = screen.getByLabelText('Message Id');
    const payloadTypeField = screen.queryByLabelText('Payload type');
    const payloadTypeSwitch = screen.queryByLabelText('Enter type');

    const sendMessageBtn = screen.getAllByText('Send reply')[1];
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();
    expect(messageIdField).toBeInTheDocument();

    expect(payloadTypeField).toBeNull();
    expect(payloadTypeSwitch).toBeNull();

    expect(sendMessageBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    const [, meta] = mockProgram.mock.results[0].value as [ProgramModel, Metadata];

    const decodedTypes = decodeHexTypes(meta.types!);
    const typeStructure = createPayloadTypeStructure(meta.handle_input!, decodedTypes) as TypeStructure;

    const formValues: FormValues = {
      value: 1000,
      payload: getPayloadValue(typeStructure),
      gasLimit: 30000000,
      payloadType: 'Bytes',
      destination: MESSAGE_ID,
    };

    // calculate gas

    fireEvent.click(calculateGasBtn);

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith(
      'reply',
      TEST_API,
      formValues,
      expect.any(Object),
      meta,
      null,
      MESSAGE_ID,
      'replyError'
    );

    // authorized submit

    submit(sendMessageBtn);

    const message = {
      value: formValues.value.toString(),
      payload: getSubmitPayload(formValues.payload),
      gasLimit: '2400000',
      replyToId: formValues.destination,
      destination: formValues.destination,
    };

    await waitFor(() => {
      expect(sendMessageMock).toBeCalledTimes(1);
      expect(sendMessageMock).toBeCalledWith(
        TEST_API.reply,
        TEST_ACCOUNT,
        message,
        expect.any(Object),
        expect.any(Function),
        meta,
        undefined
      );
    });
  });
});
