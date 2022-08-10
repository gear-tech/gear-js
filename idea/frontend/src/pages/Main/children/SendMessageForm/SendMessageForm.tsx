import { useRef, useState } from 'react';
import { Hex, Metadata } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';

import { FormWrapper } from '../FormWrapper';
import { DestinationForm, FormValues } from './children/DestinationForm';

import { getProgram } from 'services';
import { RPCResponseError } from 'services/ServerRPCRequestService';
import { MessageForm, RenderButtonsProps } from 'components/blocks/MessageForm';
import sendMessageSVG from 'assets/images/message.svg';

type Props = {
  onReset: () => void;
};

const SendMessageForm = ({ onReset }: Props) => {
  const alert = useAlert();

  const destination = useRef<string>('');

  const [step, setStep] = useState(1);
  const [metadata, setMetadata] = useState<Metadata>();

  const goToFirstStep = () => setStep(1);

  const goToSecondStep = (newDestination: string) => {
    destination.current = newDestination;
    setStep(2);
  };

  const handleDestinationSubmit = async (values: FormValues) => {
    const newDestination = values.destination;

    if (newDestination === destination.current) {
      goToSecondStep(newDestination);

      return;
    }

    try {
      const { result } = await getProgram(newDestination);
      const meta = result?.meta?.meta;

      if (meta) setMetadata(JSON.parse(meta));

      goToSecondStep(newDestination);
    } catch (error) {
      const message = (error as RPCResponseError).message;

      if (message === 'Program not found') {
        goToSecondStep(newDestination);

        return;
      }

      alert.error(message);
    }
  };

  const renderFormButtons = ({ isDisabled, calculateGas }: RenderButtonsProps) => (
    <>
      <Button text="Previous step" color="secondary" onClick={goToFirstStep} />
      <Button text="Calculate Gas" onClick={calculateGas} disabled={isDisabled} />
      <Button type="submit" icon={sendMessageSVG} text="Send message" disabled={isDisabled} />
      <Button text="Cancel" onClick={onReset} color="transparent" />
    </>
  );

  return (
    <FormWrapper header="Send new message">
      {step === 1 && (
        <DestinationForm destination={destination.current} onReset={onReset} onSubmit={handleDestinationSubmit} />
      )}
      {step === 2 && destination && (
        <MessageForm id={destination.current as Hex} metadata={metadata} renderButtons={renderFormButtons} />
      )}
    </FormWrapper>
  );
};

export { SendMessageForm };
