import { useEffect, useState } from 'react';

import { FormWrapper } from '../FormWrapper';
import { ProgramForm, FormValues } from './children/ProgramForm';

import { useProgram } from 'hooks';
import { MessageForm } from 'components/blocks/MessageForm';

type Props = {
  onReset: () => void;
};

const SendMessageForm = ({ onReset }: Props) => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [destination, setDestination] = useState<string>();

  const [program, metadata] = useProgram(destination);

  const handleProgranSubmit = (values: FormValues) => {
    setIsLoading(true);
    setDestination(values.destination);
  };

  useEffect(() => {
    if (program && isLoading) {
      setStep(1);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  return (
    <FormWrapper header="Send new message">
      {step === 0 && <ProgramForm isLoading={isLoading} destination={destination} onSubmit={handleProgranSubmit} />}
      {step === 1 && program && <MessageForm id={program.id} metadata={metadata} />}
    </FormWrapper>
  );
};

export { SendMessageForm };
