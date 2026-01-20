import { OptionHTMLAttributes, SelectHTMLAttributes } from 'react';

import { LabelContainer } from '../label-container';

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  options: readonly OptionHTMLAttributes<HTMLOptionElement>[];
  label?: string;
  error?: string;
};

const Select = ({ label, error, options, className, ...props }: Props) => {
  const renderOptions = () =>
    options.map((option) => (
      <option key={option.value?.toString()} value={option.value}>
        {option.label}
      </option>
    ));

  return (
    <LabelContainer label={label} error={error} className={className}>
      <select {...props} aria-invalid={Boolean(error)}>
        {renderOptions()}
      </select>
    </LabelContainer>
  );
};

export { Select };
