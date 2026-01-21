import { LabelContainer } from '../label-container';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

const Textarea = ({ label, error, className, ...props }: Props) => {
  return (
    <LabelContainer label={label} error={error} className={className}>
      <textarea {...props} aria-invalid={Boolean(error)} />
    </LabelContainer>
  );
};

export { Textarea };
