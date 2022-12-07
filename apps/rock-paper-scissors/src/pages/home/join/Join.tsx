import { Input, Button } from "@gear-js/ui";
import { useForm } from '@mantine/form';
import { BackButton } from 'components';
import { Hex } from '@gear-js/api';
import styles from './Join.module.scss';

type Props = {
    onBackClick: (arg: string) => void;
    onClickSubmit: (arg: Hex) => void;
    onSubmit?: any;
};

const initialValues = {
    programId: ``
};


function Join({ onBackClick, onClickSubmit }: Props) {
    const form = useForm({ initialValues });
    const { getInputProps } = form;
    const handleSubmit = form.onSubmit((values) => {onClickSubmit(JSON.parse(JSON.stringify(values.programId)))});
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Join game</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input autoComplete="off" label="Program Id" direction="y"  {...getInputProps('programId')} />
            </form>
            <div className={styles.buttons}>
                <BackButton onClick={() => onBackClick('')} />
                <Button type="submit" text="Join" size="large" onClick={()=>handleSubmit()} />
            </div>
        </div>
    )
}

export { Join };