import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, it, expect } from 'vitest';

import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const initButtons = [
  { label: 'first radio', value: '0' },
  { label: 'second radio', value: '1' },
  { label: 'third radio', value: '2', name: 'random name', checked: true, onChange: () => {} },
];

describe('radio button tests', () => {
  it('renders radio button', () => {
    render(<Radio label="test radio" />);
    const button = screen.getByLabelText('test radio');
    expect(button).toBeInTheDocument();
  });

  it('applies className to label wrapper', () => {
    render(<Radio label="test radio" className="className" />);

    const button = screen.getByRole('radio');
    const label = screen.getByText('test radio');

    expect(button).not.toHaveClass('className');
    expect(label).toHaveClass('className');
  });

  it('renders disabled button', () => {
    render(<Radio label="test radio" disabled />);

    const button = screen.getByRole('radio');
    const label = screen.getByText('test radio');

    expect(button).toBeDisabled();
    expect(label).toHaveClass('disabled');
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Radio label="test radio" ref={ref} />);

    const button = screen.getByLabelText('test radio');

    expect(ref.current).toBe(button);
  });
});

describe('radio group tests', () => {
  it('overrides button attributes', () => {
    render(<RadioGroup buttons={initButtons} name="test" />);

    const buttons = screen.getAllByRole('radio');
    const lastButton = screen.getByLabelText('third radio');

    buttons.forEach((button) => expect(button).toHaveAttribute('name', 'test'));
    expect(lastButton).toHaveAttribute('value', '2');
    expect(lastButton).toBeChecked();
  });

  it('overrides checked attribute on set value', () => {
    render(<RadioGroup buttons={initButtons} name="test" value="0" onChange={() => {}} />);

    const firstButton = screen.getByLabelText('first radio');
    const lastButton = screen.getByLabelText('third radio');

    fireEvent.click(lastButton);
    expect(firstButton).toBeChecked();
  });

  it('clicks button', () => {
    render(<RadioGroup buttons={initButtons} />);

    const firstButton = screen.getByLabelText('first radio');

    fireEvent.click(firstButton);
    expect(firstButton).toBeChecked();
  });

  it('clicks controlled button', () => {
    const ControlledRadioGroup = () => {
      const [value, setValue] = useState('0');

      return (
        <RadioGroup
          buttons={initButtons}
          name="test"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    };

    render(<ControlledRadioGroup />);

    const secondButton = screen.getByLabelText('second radio');

    fireEvent.click(secondButton);
    expect(secondButton).toBeChecked();
  });
});
