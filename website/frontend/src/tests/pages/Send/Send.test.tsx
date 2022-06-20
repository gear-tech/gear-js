import { Router, MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, within, render, fireEvent, waitFor } from '@testing-library/react';

import { PROGRAM, PROGRAM_ID } from './inputData';
import { useProgramMock } from '../../mocks/hooks';

import { AlertProvider } from 'context';
import * as ApiService from 'services/ApiService';
import { Send } from 'components/pages/Send/Send';

type Props = {
  path: string;
  initialEntries: string[];
};

const SendMessagePage = ({ path, initialEntries }: Props) => (
  <AlertProvider>
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path={path} element={<Send />} />
      </Routes>
    </MemoryRouter>
  </AlertProvider>
);

describe('send message page tests', () => {
  const sendMessageMock = jest.spyOn(ApiService, 'sendMessage').mockResolvedValue();

  const submit = () => {
    fireEvent.submit(screen.getByText('Send message'));
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

  it('test form without meta', () => {
    useProgramMock(PROGRAM);

    render(<SendMessagePage path="/send/message/:programId" initialEntries={[`/send/message/${PROGRAM_ID}`]} />);

    expect(screen.getByText('NFT')).toBeInTheDocument();
    expect(screen.getByText('New message')).toBeInTheDocument();

    const valueField = screen.getByLabelText('Value');
    const gasLimitField = screen.getByLabelText('Gas limit');
    const destinationField = screen.getByLabelText('Destination');
    const payloadTypeField = screen.getByLabelText('Payload type');
    const payloadTypeSwitch = screen.getByLabelText('Enter type');

    const sendMessageBtn = screen.getByText('Send message');
    const calculateGasBtn = screen.getByText('Calculate Gas');

    expect(valueField).toBeInTheDocument();
    expect(gasLimitField).toBeInTheDocument();
    expect(destinationField).toBeInTheDocument();

    expect(payloadTypeField).toBeDisabled();
    expect(payloadTypeField).toBeInTheDocument();
    expect(payloadTypeField).toHaveValue('Bytes');

    expect(payloadTypeSwitch).toBeInTheDocument();

    expect(sendMessageBtn).toBeInTheDocument();
    expect(calculateGasBtn).toBeInTheDocument();

    changeFieldValue(valueField, '1000');
    expect(valueField).toHaveValue(1000);

    changeFieldValue(gasLimitField, '30000000');
    expect(gasLimitField).toHaveValue('30,000,000');

    changeFieldValue(destinationField, 'program');
    expect(destinationField).toHaveValue('program');

    fireEvent.click(payloadTypeSwitch);

    expect(payloadTypeField).not.toBeDisabled();

    changeFieldValue(payloadTypeField, 'u32');
    expect(payloadTypeField).toHaveValue('u32');

    submit();
  });
});
