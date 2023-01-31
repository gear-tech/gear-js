import { Button, Input } from '@gear-js/ui';
import { useForm } from '@mantine/form';
import { hexRequired } from 'app/utils/form-validations';
import { createTamagotchiInitial } from 'app/consts';
import { useBattleMessage } from 'app/hooks/use-battle-message';
import { useBattle } from '../../../app/context';

const validate: Record<string, typeof hexRequired> = {
  programId: hexRequired,
};

export const StartBattleForm = () => {
  const { battleState } = useBattle();
  const handleMessage = useBattleMessage();
  const form = useForm({
    initialValues: createTamagotchiInitial,
    validate,
    validateInputOnChange: true,
  });
  const { getInputProps, errors } = form;
  const handleSubmit = form.onSubmit((values) => {
    const onSuccess = () => form.reset();
    handleMessage({ Register: { tmg_id: values.programId } }, { onSuccess });
  });

  return (
    <div className="space-y-10">
      <h2 className="text-center typo-h2">Registration for Battle</h2>
      <p className="text-center text-white text-opacity-70">Current players' queue: {battleState?.players.length}</p>
      <form onSubmit={handleSubmit} className="flex items-start justify-center gap-6">
        <div className="basis-[400px]">
          <Input placeholder="Insert program ID" direction="y" {...getInputProps('programId')} />
        </div>
        <div className="whitespace-nowrap">
          <Button text="Register Tamagotchi" color="primary" type="submit" disabled={Object.keys(errors).length > 0} />
        </div>
      </form>
    </div>
  );
};
