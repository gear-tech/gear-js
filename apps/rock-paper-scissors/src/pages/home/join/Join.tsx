import { Input, Button } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { BackButton } from 'components';
import { Hex } from '@gear-js/api';
import { isExists } from 'utils';
import styles from './Join.module.scss';

type Props = {
  onClickRouteChange: (arg: string) => void;
  setProgramID: (arg: Hex) => void;
  setLoading: (arg: boolean) => void;
};

const initialValues = { programId: `` as string };

const validate = { programId: isExists };

const transformValues = (values: { programId: string }) => values.programId.toLowerCase();

function Join({ onClickRouteChange, setProgramID, setLoading }: Props) {
  const form = useForm({ initialValues, validate, transformValues });
  const { getInputProps } = form;
  const handleSubmit = form.onSubmit((programId) => {
    setLoading(true);
    setProgramID(programId as Hex);
    onClickRouteChange('Join game');
  });
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Join game</h2>
      <form id='form' className={styles.form} onSubmit={handleSubmit}>
        <Input autoComplete="off" label="Program Id" direction="y" {...getInputProps('programId')} />
      </form>
      <div className={styles.buttons}>
        <BackButton onClick={() => onClickRouteChange('')} />
        <Button form='form' type="submit" text="Join" size="large"/>
      </div>
    </div>
  );
}

export { Join };
