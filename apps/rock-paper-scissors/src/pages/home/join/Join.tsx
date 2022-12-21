import { Input, Button } from "@gear-js/ui";
import { useForm } from '@mantine/form';
import { BackButton } from 'components';
import { Hex } from '@gear-js/api';
import styles from './Join.module.scss';

type Props = {
    onClickRouteChange: (arg: string) => void;
    setProgramID: (arg: Hex) => void;
    onSubmit?: any;
};

const initialValues = {
    programId: ``
};


function Join({ onClickRouteChange, setProgramID }: Props) {
    const form = useForm({ initialValues });
    const { getInputProps } = form;
    const handleSubmit = form.onSubmit((values) => {
        if(!values.programId)return;
        const valueLowered=values.programId.toLowerCase();
        setProgramID(valueLowered as Hex)
        onClickRouteChange('Join game')
    });
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Join game</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input autoComplete="off" label="Program Id" direction="y"  {...getInputProps('programId')} />
            </form>
            <div className={styles.buttons}>
                <BackButton onClick={() => onClickRouteChange('')} />
                <Button type="submit" text="Join" size="large" onClick={() => handleSubmit()} />
            </div>
        </div>
    )
}

export { Join };