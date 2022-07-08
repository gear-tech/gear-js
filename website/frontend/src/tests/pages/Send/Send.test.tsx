import { decodeHexTypes, createPayloadTypeStructure } from '@gear-js/api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, render, fireEvent, waitFor, act } from '@testing-library/react';
import { AccountProvider } from '@gear-js/react-hooks';

import { useAccountMock, useApiMock, TEST_API, TEST_ACCOUNT } from '../../mocks/hooks';
import { PROGRAM_ID_1, PROGRAM_ID_2, MESSAGE_ID_1, MESSAGE_ID_2, META } from '../../const';

import * as helpers from 'helpers';
import { ApiProvider } from 'context/api';
import { AlertProvider } from 'context/alert';
import { Send } from 'pages/Send/Send';
import { FormValues } from 'pages/Send/children/MessageForm/types';
import { TypeStructure } from 'components/common/Form/FormPayload/types';
import { getPayloadValue } from 'components/common/Form/FormPayload/helpers';

type Props = {
  path: string;
  initialEntries: string[];
};

const SendMessagePage = ({ path, initialEntries }: Props) => (
  <AlertProvider>
    <ApiProvider>
      <AccountProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path={path} element={<Send />} />
          </Routes>
        </MemoryRouter>
      </AccountProvider>
    </ApiProvider>
  </AlertProvider>
);

jest.mock('@polkadot/extension-dapp', () => ({
  web3FromSource: () => Promise.resolve({ signer: 'signer' }),
}));

describe('send message page tests', () => {
  const submit = (element: Element) => {
    fireEvent.submit(element);
  };

  const changeFieldValue = (element: Element | Node, value: string) => {
    fireEvent.change(element, { target: { value } });
  };

  const testInitPageLoading = async () => {
    // show loader
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('sendMessageForm')).not.toBeInTheDocument();

    // show page content
    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
      expect(screen.getByTestId('sendMessageForm')).toBeInTheDocument();
    });
  };

  it('sends message to program without meta', async () => {
    useApiMock(TEST_API);
    useAccountMock();

    TEST_API.message.submit.mockResolvedValue('');
    TEST_API.message.signAndSend.mockResolvedValue('');

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);

    const { rerender } = render(
      <SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID_2}`]} />
    );

    await testInitPageLoading();

    // header

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

    await waitFor(() => expect(screen.getByText('Wallet not connected')).toBeInTheDocument());

    useAccountMock(TEST_ACCOUNT);

    rerender(<SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID_2}`]} />);

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
    // some formik error, act must be used
    act(() => {
      fireEvent.click(calculateGasBtn);
    });

    await waitFor(() => expect(gasLimitField).toHaveValue('2,400,000'));

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith(
      'handle',
      TEST_API,
      formValues,
      expect.any(Object),
      undefined,
      null,
      PROGRAM_ID_2
    );

    // authorized submit

    submit(sendMessageBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText('gear.sendMessage')).toBeInTheDocument();
    });
  });

  it('sends message to program with meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT);

    TEST_API.message.submit.mockResolvedValue('');
    TEST_API.message.signAndSend.mockResolvedValue('');

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);

    render(<SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID_1}`]} />);

    await testInitPageLoading();

    // header

    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('New message')).toBeInTheDocument();

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

    expect(payloadTypeField).not.toBeInTheDocument();
    expect(payloadTypeSwitch).not.toBeInTheDocument();

    expect(sendMessageBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    changeFieldValue(destinationField, 'program');
    expect(destinationField).toHaveValue('program');

    const decodedTypes = decodeHexTypes(META.types!);
    const typeStructure = createPayloadTypeStructure(META.handle_input!, decodedTypes) as TypeStructure;

    const formValues: FormValues = {
      value: 1000,
      payload: getPayloadValue(typeStructure),
      gasLimit: 30000000,
      payloadType: 'Bytes',
      destination: 'program',
    };

    // calculate gas

    act(() => {
      fireEvent.click(calculateGasBtn);
    });

    await waitFor(() => expect(gasLimitField).toHaveValue('2,400,000'));

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith('handle', TEST_API, formValues, expect.any(Object), META, null, PROGRAM_ID_1);

    // authorized submit

    submit(sendMessageBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText('gear.sendMessage')).toBeInTheDocument();
    });
  });

  it('sends reply to message of program without meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT);

    TEST_API.reply.submit.mockResolvedValue('');
    TEST_API.reply.signAndSend.mockResolvedValue('');

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);

    render(<SendMessagePage path="/send/reply/:messageId" initialEntries={[`/send/reply/${MESSAGE_ID_2}`]} />);

    await testInitPageLoading();

    // header

    expect(screen.getByText('NFT')).toBeInTheDocument();

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
      destination: MESSAGE_ID_2,
    };

    // calculate gas

    act(() => {
      fireEvent.click(calculateGasBtn);
    });

    await waitFor(() => expect(gasLimitField).toHaveValue('2,400,000'));

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith(
      'reply',
      TEST_API,
      formValues,
      expect.any(Object),
      undefined,
      null,
      MESSAGE_ID_2
    );

    // authorized submit

    submit(sendReplyBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText('gear.sendMessage')).toBeInTheDocument();
    });
  });

  it('sends reply to message of program with meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT);

    TEST_API.reply.submit.mockResolvedValue('');
    TEST_API.reply.signAndSend.mockResolvedValue('');

    const calculateGas = jest.spyOn(helpers, 'calculateGas').mockResolvedValue(2400000);

    render(<SendMessagePage path="/reply/message/:messageId" initialEntries={[`/reply/message/${MESSAGE_ID_1}`]} />);

    await testInitPageLoading();

    // header

    expect(screen.getByText('NFT')).toBeInTheDocument();

    // checking if fields are present in a form

    const valueField = screen.getByLabelText('Value');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const messageIdField = screen.getByLabelText('Message Id');
    const payloadTypeField = screen.queryByLabelText('Payload type');
    const payloadTypeSwitch = screen.queryByLabelText('Enter type');

    const sendReplyBtn = screen.getAllByText('Send reply')[1];
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();
    expect(messageIdField).toBeInTheDocument();

    expect(payloadTypeField).not.toBeInTheDocument();
    expect(payloadTypeSwitch).not.toBeInTheDocument();

    expect(sendReplyBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    const decodedTypes = decodeHexTypes(META.types!);
    const typeStructure = createPayloadTypeStructure(META.handle_input!, decodedTypes) as TypeStructure;

    const formValues: FormValues = {
      value: 1000,
      payload: getPayloadValue(typeStructure),
      gasLimit: 30000000,
      payloadType: 'Bytes',
      destination: MESSAGE_ID_1,
    };

    // calculate gas

    act(() => {
      fireEvent.click(calculateGasBtn);
    });

    await waitFor(() => expect(gasLimitField).toHaveValue('2,400,000'));

    expect(calculateGas).toBeCalledTimes(1);
    expect(calculateGas).toBeCalledWith('reply', TEST_API, formValues, expect.any(Object), META, null, MESSAGE_ID_1);

    // authorized submit

    submit(sendReplyBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText('gear.sendMessage')).toBeInTheDocument();
    });
  });
});
