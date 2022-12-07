import { useCreateHandler } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { BackButton } from 'components';
import { isExists, isMinValue } from 'utils';
import styles from './Create.module.scss';

type Props = {
  onBackClick: (arg: string) => void;
  onSubmit: ReturnType<typeof useCreateHandler>;
  setStateAction: any
};

const initialValues = {
  // gameName: '',
  betSize: '',
  playersCountLimit: '',
  entryTimeoutMs: '',
  moveTimeoutMs: '',
  revealTimeoutMs: '',
};
const transformValues = (values: any) => ({
  betSize: values.betSize,
  playersCountLimit: values.playersCountLimit,
  entryTimeoutMs: `${values.entryTimeoutMs}000`,
  moveTimeoutMs: `${values.moveTimeoutMs}000`,
  revealTimeoutMs: `${values.revealTimeoutMs}000`,
})

const validate = {
  // gameName: isExists,
  betSize: (value: string) => (isExists(value) || isMinValue(Number(value), 1000)),
  playersCountLimit: (value: string) => (isExists(value) || isMinValue(Number(value), 2)),
  entryTimeoutMs: (value: string) => (isExists(value) || isMinValue(Number(value), 10)),
  moveTimeoutMs: (value: string) => (isExists(value) || isMinValue(Number(value), 10)),
  revealTimeoutMs: (value: string) => (isExists(value) || isMinValue(Number(value), 10)),
};

function Create({ onBackClick, onSubmit, setStateAction }: Props) {
  const form = useForm({ initialValues, validate, transformValues, });
  const { getInputProps } = form;
  const handleSubmit = form.onSubmit((values) => {
    onSubmit(values, { onSuccess: (hex) => { setStateAction(hex); } })
  });

  return (
    <>
      <h2 className={styles.heading}>Create new game</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* <Input label="Game name" direction="y" {...getInputProps('gameName')} /> */}
        <Input autoComplete="off" type='number' label="Bet size" direction="y" {...getInputProps('betSize')} />
        <Input autoComplete="off" type='number' label="Max players" direction="y" {...getInputProps('playersCountLimit')} />
        <Input autoComplete="off" type='number' label="Entry timeout (seconds)" direction="y" {...getInputProps('entryTimeoutMs')} />
        <Input autoComplete="off" type='number' label="Move timeout (seconds)" direction="y" {...getInputProps('moveTimeoutMs')} />
        <Input autoComplete="off" type='number' label="Reveal timeout (seconds)" direction="y" {...getInputProps('revealTimeoutMs')} />
        <div className={styles.buttons}>
          <BackButton onClick={() => onBackClick('')} />
          <Button type="submit" text="Create" size="large" />
        </div>
      </form>
    </>
  );
}

export { Create };
