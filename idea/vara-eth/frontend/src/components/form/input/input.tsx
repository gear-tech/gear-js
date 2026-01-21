import { LabelContainer } from '../label-container';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = ({ label, error, className, ...props }: Props) => {
  return (
    <LabelContainer label={label} error={error} className={className}>
      <input {...props} aria-invalid={Boolean(error)} />
    </LabelContainer>
  );
};

export { Input };
