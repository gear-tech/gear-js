import { Button, Input } from "@gear-js/ui";
import { useState } from "react"
import styles from './InputField.module.scss'

type Props = {
    getInputValue: (arg: string) => void;
}



function InputField({ getInputValue }: Props) {
    const [inputValue, setInputValue] = useState('')

    const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        getInputValue(inputValue)
    }
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Input autoComplete="off"  onChange={onChangeInput} />
            <div className={styles.buttons}>
                <Button type='submit' text="submit" size="medium" />
            </div>
        </form>
    )
}

export { InputField }