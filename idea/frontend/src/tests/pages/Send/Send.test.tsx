import { decodeHexTypes, createPayloadTypeStructure } from '@gear-js/api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';

import { useApiMock, useAccountMock, useGasCalculateMock, TEST_API, TEST_ACCOUNT_1 } from '../../mocks/hooks';
import {
  META,
  DEPOSIT,
  REPLY_META,
  MAX_GAS_LIMIT,
  PROGRAM_ID_1,
  PROGRAM_ID_2,
  MESSAGE_ID_1,
  MESSAGE_ID_2,
  PARTIAL_FEE,
} from '../../const';
import { renderWithProviders } from '../../utils';

import * as helpers from 'helpers';
import { ACCOUNT_ERRORS, TransactionName } from 'consts';
import { Send } from 'pages/Send/Send';
import { FormValues } from 'components/blocks/MessageForm/types';
import { TypeStructure } from 'components/common/Form/FormPayload/types';
import { getPayloadValue } from 'components/common/Form/FormPayload/helpers';

type Props = {
  path: string;
  initialEntries: string[];
};

const SendMessagePage = ({ path, initialEntries }: Props) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route path={path} element={<Send />} />
    </Routes>
  </MemoryRouter>
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
    fireEvent.blur(element);
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

  const checkTransactionModal = async (id: string, transactionName = TransactionName.SendMessage) => {
    const modal = await screen.findByTestId('modal');

    expect(within(modal).getByText('Transaction details'));
    expect(within(modal).getByText('Sending transaction'));
    expect(within(modal).getByText(transactionName));
    expect(within(modal).getByText(`Fees of ${PARTIAL_FEE.partialFee.toHuman()} will be applied to the submission`));
    expect(within(modal).getByText('From:'));
    expect(within(modal).getByText(helpers.getShortName(TEST_ACCOUNT_1.address)));
    expect(within(modal).getByText('To:'));
    expect(within(modal).getByText(helpers.getShortName(id)));

    expect(within(modal).getByText('Submit'));
    expect(within(modal).getByText('Cancel'));
  };

  it('show error if wallet not connected', async () => {
    TEST_API.message.paymentInfo.mockResolvedValue(PARTIAL_FEE);
    TEST_API.blockGasLimit.toNumber.mockReturnValue(MAX_GAS_LIMIT);
    TEST_API.existentialDeposit.toNumber.mockReturnValue(DEPOSIT);

    useApiMock(TEST_API);
    useAccountMock();

    renderWithProviders(
      <SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID_2}`]} />
    );

    const sendMessageBtn = await screen.findByText('Send message');

    submit(sendMessageBtn);

    await waitFor(() => expect(screen.getByText(ACCOUNT_ERRORS.WALLET_NOT_CONNECTED)).toBeInTheDocument());
  });

  it('sends message to program without meta', async () => {
    TEST_API.message.send.mockResolvedValue('');
    TEST_API.message.signAndSend.mockResolvedValue('');
    TEST_API.message.paymentInfo.mockResolvedValue(PARTIAL_FEE);
    TEST_API.blockGasLimit.toNumber.mockReturnValue(MAX_GAS_LIMIT);
    TEST_API.existentialDeposit.toNumber.mockReturnValue(DEPOSIT);

    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT_1);
    const { calculateGasMock } = useGasCalculateMock(2400000);

    renderWithProviders(
      <SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID_2}`]} />
    );

    await testInitPageLoading();

    // header

    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('New message')).toBeInTheDocument();

    // checking if fields are present in a form

    const destination = screen.getByText('Destination');
    const destinationValue = screen.getByText(PROGRAM_ID_2);

    expect(destination).toBeInTheDocument();
    expect(destinationValue).toBeInTheDocument();

    const valueField = screen.getByLabelText('Value');
    const payloadField = screen.getByLabelText('Payload');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const payloadTypeField = screen.getByLabelText('Payload type');
    const payloadTypeSwitch = screen.getByLabelText('Enter type');

    const sendMessageBtn = screen.getByText('Send message');
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(payloadField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();

    expect(payloadTypeField).toBeDisabled();
    expect(payloadTypeField).toBeInTheDocument();
    expect(payloadTypeField).toHaveValue('Bytes');

    expect(payloadTypeSwitch).toBeInTheDocument();

    expect(sendMessageBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    const checkBtnDisabled = () => {
      expect(sendMessageBtn).toBeDisabled();
      expect(calculateGasBtn).toBeDisabled();
    };

    const checkBtnEnabled = () => {
      expect(sendMessageBtn).toBeEnabled();
      expect(calculateGasBtn).toBeEnabled();
    };

    checkBtnEnabled();

    // validate value field

    changeFieldValue(valueField, '-1');

    expect(valueField).toHaveValue(-1);

    const valueFieldError = await screen.findByText(`Value should be more ${DEPOSIT} or equal than 0`);

    expect(valueFieldError).toBeInTheDocument();

    checkBtnDisabled();

    changeFieldValue(valueField, '1000');

    expect(valueField).toHaveValue(1000);
    await waitFor(() => expect(valueFieldError).not.toBeInTheDocument());

    checkBtnEnabled();

    // validate payload field

    changeFieldValue(payloadField, '');

    expect(payloadField).toHaveValue('');

    await waitFor(() => expect(screen.queryByText('Invalid payload')).not.toBeInTheDocument());

    checkBtnEnabled();

    fireEvent.click(payloadTypeSwitch);

    expect(payloadTypeField).toBeEnabled();

    changeFieldValue(payloadTypeField, 'u16');

    expect(payloadTypeField).toHaveValue('u16');

    await waitFor(() => expect(screen.queryByText('This field is required')).not.toBeInTheDocument());

    changeFieldValue(payloadField, '12345678');

    const payloadFieldError = await screen.findByText('Invalid payload');

    expect(payloadField).toHaveValue('12345678');
    expect(payloadFieldError).toBeInTheDocument();

    checkBtnDisabled();
    changeFieldValue(payloadField, '12345');

    expect(payloadField).toHaveValue('12345');

    await waitFor(() => expect(payloadFieldError).not.toBeInTheDocument());

    checkBtnEnabled();

    // validate gas limit field

    changeFieldValue(gasLimitField, '');

    let gasLimitFieldError = await screen.findByText('This field is required');

    expect(gasLimitField).toHaveValue('');
    expect(gasLimitFieldError).toBeInTheDocument();

    checkBtnDisabled();

    changeFieldValue(gasLimitField, '25000000000000');

    gasLimitFieldError = await screen.findByText(`Gas limit should be less than ${MAX_GAS_LIMIT}`);
    expect(gasLimitFieldError).toBeInTheDocument();

    checkBtnDisabled();

    changeFieldValue(gasLimitField, '30000000');

    expect(gasLimitField).toHaveValue('30,000,000');

    await waitFor(expect(gasLimitFieldError).not.toBeInTheDocument);

    checkBtnEnabled();

    // validate payload type field

    changeFieldValue(payloadTypeField, '');

    const payloadTypeFieldError = await screen.findByText('This field is required');

    expect(payloadTypeFieldError).toBeInTheDocument();

    checkBtnDisabled();

    changeFieldValue(payloadTypeField, 'u16');

    await waitFor(expect(payloadTypeFieldError).not.toBeInTheDocument);

    checkBtnEnabled();

    const formValues: FormValues = {
      value: 1000,
      payload: '12345',
      gasLimit: 30000000,
      payloadType: 'u16',
    };

    // calculate gas
    fireEvent.click(calculateGasBtn);

    await waitFor(() => expect(calculateGasMock).toBeCalledTimes(1));
    expect(calculateGasMock).toBeCalledWith('handle', formValues, null, undefined, PROGRAM_ID_2);

    // show modal

    submit(sendMessageBtn);

    await checkTransactionModal(PROGRAM_ID_2);

    // close modal

    checkBtnDisabled();

    const modalCancelBtn = screen.getByText('Cancel');

    fireEvent.click(modalCancelBtn);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    checkBtnEnabled();

    // authorized submit

    submit(sendMessageBtn);

    const modalSubmitBtn = await screen.findByText('Submit');

    fireEvent.click(modalSubmitBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText(TransactionName.SendMessage)).toBeInTheDocument();
    });
  });

  it('sends message to program with meta', async () => {
    TEST_API.message.send.mockResolvedValue('');
    TEST_API.message.signAndSend.mockResolvedValue('');
    TEST_API.message.paymentInfo.mockResolvedValue(PARTIAL_FEE);
    TEST_API.blockGasLimit.toNumber.mockReturnValue(MAX_GAS_LIMIT);
    TEST_API.existentialDeposit.toNumber.mockReturnValue(DEPOSIT);

    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT_1);
    const { calculateGasMock } = useGasCalculateMock(2400000);

    renderWithProviders(
      <SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID_1}`]} />
    );

    await testInitPageLoading();

    // header

    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('New message')).toBeInTheDocument();

    // checking if fields are present in a form

    const destination = screen.getByText('Destination');
    const destinationValue = screen.getByText(PROGRAM_ID_1);

    expect(destination).toBeInTheDocument();
    expect(destinationValue).toBeInTheDocument();

    const valueField = screen.getByLabelText('Value');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const payloadTypeField = screen.queryByLabelText('Payload type');
    const payloadTypeSwitch = screen.queryByLabelText('Enter type');

    const sendMessageBtn = screen.getByText('Send message');
    const calculateGasBtn = screen.getByText('Calculate Gas');

    const payloadSelector = screen.getByRole('combobox');

    expect(valueField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();

    expect(payloadTypeField).not.toBeInTheDocument();
    expect(payloadTypeSwitch).not.toBeInTheDocument();

    expect(sendMessageBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    const checkBtnDisabled = () => {
      expect(sendMessageBtn).toBeDisabled();
      expect(calculateGasBtn).toBeDisabled();
    };

    const checkBtnEnabled = () => {
      expect(sendMessageBtn).toBeEnabled();
      expect(calculateGasBtn).toBeEnabled();
    };

    checkBtnEnabled();

    // payload validation

    changeFieldValue(payloadSelector, 'Transfer');

    const firstPayloadField = await screen.findByLabelText('to (ActorId)');
    const secondPayloadField = screen.getByLabelText('tokenId (U256)');

    expect(firstPayloadField).toBeInTheDocument();
    expect(secondPayloadField).toBeInTheDocument();

    checkBtnEnabled();

    changeFieldValue(firstPayloadField, '1');

    let payloadError = await screen.findByText('Invalid payload');

    expect(payloadError).toBeInTheDocument();
    expect(firstPayloadField).toHaveValue('1');

    checkBtnDisabled();
    changeFieldValue(firstPayloadField, '0x68780805f94b15bc01f2d5428fa7bdbde6a14f77841ee24416c47c571a274f05');

    expect(firstPayloadField).toHaveValue('0x68780805f94b15bc01f2d5428fa7bdbde6a14f77841ee24416c47c571a274f05');
    await waitFor(expect(payloadError).not.toBeInTheDocument);

    checkBtnEnabled();
    changeFieldValue(secondPayloadField, '1b');

    expect(secondPayloadField).toHaveValue('1b');
    payloadError = await screen.findByText('Invalid payload');

    expect(payloadError).toBeInTheDocument();

    checkBtnDisabled();
    changeFieldValue(payloadSelector, 'Mint');

    await waitFor(expect(payloadError).not.toBeInTheDocument);

    checkBtnEnabled();

    // change form fileds

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
    };

    // calculate gas

    fireEvent.click(calculateGasBtn);

    await waitFor(() => expect(gasLimitField).toHaveValue('2,400,000'));

    expect(calculateGasMock).toBeCalledTimes(1);
    expect(calculateGasMock).toBeCalledWith('handle', formValues, null, META, PROGRAM_ID_1);

    // authorized submit

    submit(sendMessageBtn);

    await checkTransactionModal(PROGRAM_ID_1);

    const modalSubmitBtn = await screen.findByText('Submit');

    fireEvent.click(modalSubmitBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText(TransactionName.SendMessage)).toBeInTheDocument();
    });
  });

  it('sends reply to message of program without meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT_1);

    TEST_API.message.sendReply.mockResolvedValue('');
    TEST_API.message.signAndSend.mockResolvedValue('');
    TEST_API.message.paymentInfo.mockResolvedValue(PARTIAL_FEE);
    TEST_API.blockGasLimit.toNumber.mockReturnValue(MAX_GAS_LIMIT);
    TEST_API.existentialDeposit.toNumber.mockReturnValue(DEPOSIT);

    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT_1);
    const { calculateGasMock } = useGasCalculateMock(2400000);

    renderWithProviders(
      <SendMessagePage path="/send/reply/:messageId" initialEntries={[`/send/reply/${MESSAGE_ID_2}`]} />
    );

    await testInitPageLoading();

    // header

    expect(screen.getByText('META')).toBeInTheDocument();

    // checking if fields are present in a form

    const messageIdText = screen.getByText('Message Id');
    const messageIdValue = screen.getByText(MESSAGE_ID_2);

    expect(messageIdText).toBeInTheDocument();
    expect(messageIdValue).toBeInTheDocument();

    const valueField = screen.getByLabelText('Value');
    const payloadField = screen.getByLabelText('Payload');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const payloadTypeField = screen.getByLabelText('Payload type');
    const payloadTypeSwitch = screen.getByLabelText('Enter type');

    const sendReplyBtn = screen.getAllByText('Send reply')[1];
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(payloadField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();

    expect(payloadTypeField).toBeDisabled();
    expect(payloadTypeField).toBeInTheDocument();
    expect(payloadTypeField).toHaveValue('Bytes');

    expect(payloadTypeSwitch).toBeInTheDocument();

    expect(sendReplyBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(payloadField, '12345');
    expect(payloadField).toHaveValue('12345');

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    fireEvent.click(payloadTypeSwitch);

    expect(payloadTypeField).not.toBeDisabled();

    changeFieldValue(payloadTypeField, 'u16');
    expect(payloadTypeField).toHaveValue('u16');

    const formValues: FormValues = {
      value: 1000,
      payload: '12345',
      gasLimit: 30000000,
      payloadType: 'u16',
    };

    // calculate gas

    fireEvent.click(calculateGasBtn);

    await waitFor(() => expect(gasLimitField).toHaveValue('2,400,000'));

    expect(calculateGasMock).toBeCalledTimes(1);
    expect(calculateGasMock).toBeCalledWith('reply', formValues, null, undefined, MESSAGE_ID_2);

    // authorized submit

    submit(sendReplyBtn);

    await checkTransactionModal(MESSAGE_ID_2, TransactionName.SendReply);

    const modalSubmitBtn = await screen.findByText('Submit');

    fireEvent.click(modalSubmitBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText(TransactionName.SendReply)).toBeInTheDocument();
    });
  });

  it('sends reply to message of program with meta', async () => {
    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT_1);

    TEST_API.message.sendReply.mockResolvedValue('');
    TEST_API.message.signAndSend.mockResolvedValue('');
    TEST_API.message.paymentInfo.mockResolvedValue(PARTIAL_FEE);
    TEST_API.blockGasLimit.toNumber.mockReturnValue(MAX_GAS_LIMIT);
    TEST_API.existentialDeposit.toNumber.mockReturnValue(DEPOSIT);

    useApiMock(TEST_API);
    useAccountMock(TEST_ACCOUNT_1);
    const { calculateGasMock } = useGasCalculateMock(2400000);

    renderWithProviders(
      <SendMessagePage path="/reply/message/:messageId" initialEntries={[`/reply/message/${MESSAGE_ID_1}`]} />
    );

    await testInitPageLoading();

    // header

    expect(screen.getByText('META')).toBeInTheDocument();

    // checking if fields are present in a form

    const messageIdText = screen.getByText('Message Id');
    const messageIdValue = screen.getByText(MESSAGE_ID_1);

    expect(messageIdText).toBeInTheDocument();
    expect(messageIdValue).toBeInTheDocument();

    const valueField = screen.getByLabelText('Value');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const payloadTypeField = screen.queryByLabelText('Payload type');
    const payloadTypeSwitch = screen.queryByLabelText('Enter type');

    const sendReplyBtn = screen.getAllByText('Send reply')[1];
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();

    expect(payloadTypeField).not.toBeInTheDocument();
    expect(payloadTypeSwitch).not.toBeInTheDocument();

    expect(sendReplyBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    // form validation

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    const decodedTypes = decodeHexTypes(REPLY_META.types!);
    const typeStructure = createPayloadTypeStructure(REPLY_META.async_handle_input!, decodedTypes) as TypeStructure;

    const formValues: FormValues = {
      value: 1000,
      payload: getPayloadValue(typeStructure),
      gasLimit: 30000000,
      payloadType: 'Bytes',
    };

    // calculate gas

    fireEvent.click(calculateGasBtn);

    await waitFor(() => expect(gasLimitField).toHaveValue('2,400,000'));

    expect(calculateGasMock).toBeCalledTimes(1);
    expect(calculateGasMock).toBeCalledWith('reply', formValues, null, REPLY_META, MESSAGE_ID_1);

    // authorized submit

    submit(sendReplyBtn);

    await checkTransactionModal(MESSAGE_ID_1, TransactionName.SendReply);

    const modalSubmitBtn = await screen.findByText('Submit');

    fireEvent.click(modalSubmitBtn);

    await waitFor(() => {
      expect(screen.getByText('SignIn')).toBeInTheDocument();
      expect(screen.getByText(TransactionName.SendReply)).toBeInTheDocument();
    });
  });
});
