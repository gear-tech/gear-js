import { findByText, fireEvent, getByRole, render, screen, waitFor } from '@testing-library/react';
import { Input } from './Input';
import styles from './Input.module.scss';

const arrowIcon = 'icon-path';

describe('input tests', () => {
  it('renders input', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders input with label', async () => {
    const { rerender } = render(<Input label="label" />);

    const input = screen.getByLabelText('label');
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute('type');

    rerender(<Input label="label" type="number" direction="y" />);
    expect(input).toHaveAttribute('type', 'number');

    const inputWrapper = screen.getByTestId('inputWrapper');
    expect(inputWrapper).not.toHaveClass(styles.x);
    expect(inputWrapper).toHaveClass(styles.y);

    rerender(<Input label="label" gap="7/9" />);

    expect(inputWrapper).toHaveStyle('grid-template-columns: 7fr 9fr');

    rerender(<Input label="label" gap="7/9" tooltip="random tooltip" />);

    const tooltipWrapper = screen.getByTestId('tooltipWrapper');
    const tooltipIcon = screen.getByTestId('tooltipIcon');

    expect(tooltipIcon).toBeInTheDocument();
    expect(screen.queryByText('random tooltip')).not.toBeInTheDocument();
    expect(tooltipWrapper).toHaveAttribute('data-tooltip', 'random tooltip');
  });

  it('renders input with icon', () => {
    render(<Input label="label" icon={arrowIcon} />);

    const wrapper = screen.getByTestId('wrapper');
    const icon = screen.getByRole('img');

    expect(wrapper).toContainElement(icon);
    expect(icon).toHaveAttribute('src', arrowIcon);
  });

  it('renders search input', () => {
    const onSubmitMock = jest.fn((e) => e.preventDefault());

    render(
      <form onSubmit={onSubmitMock}>
        <Input label="label" type="search" />
      </form>,
    );

    const input = screen.getByLabelText('label');
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute('type');

    fireEvent.focus(input);

    const [, searchButton] = screen.getAllByRole('button');

    fireEvent.click(searchButton);
    expect(onSubmitMock).toBeCalled();
  });

  it('applies className to wrapper', () => {
    render(<Input label="label" className="class" />);

    const input = screen.getByRole('textbox');
    const inputWrapper = screen.getByTestId('inputWrapper');

    expect(input).not.toHaveClass('class');
    expect(inputWrapper).toHaveClass('class');
  });

  it('renders read only input', () => {
    render(<Input readOnly />);

    const wrapper = screen.getByTestId('wrapper');
    const input = screen.getByRole('textbox');

    expect(wrapper).toHaveClass(styles.readOnly);
    expect(input).toHaveAttribute('readOnly');
  });

  it('renders disabled input', () => {
    render(<Input disabled />);

    const input = screen.getByRole('textbox');
    const inputWrapper = screen.getByTestId('inputWrapper');

    expect(input).toBeDisabled();
    expect(inputWrapper).toHaveClass('disabled');
  });

  it('enters text and clicks clear button', () => {
    render(<Input label="label" color="light" size="large" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const input = screen.getByRole('textbox');

    expect(inputWrapper).not.toContainElement(screen.queryByRole('button'));

    fireEvent.focus(input);

    const clearButton = screen.getByRole('button');
    expect(inputWrapper).toContainElement(clearButton);

    fireEvent.change(input, { target: { value: '123' } });
    expect(input).toHaveValue('123');

    fireEvent.click(clearButton);
    expect(input).toHaveValue('');
  });

  it('renders large input with light color', () => {
    render(<Input label="label" color="light" size="large" />);

    const wrapper = screen.getByTestId('wrapper');

    expect(wrapper).toHaveClass(styles.light, styles.large);
    expect(wrapper).not.toHaveClass(styles.dark, styles.normal, styles.block);
  });

  it('renders input with error', () => {
    render(<Input label="label" error="random error" />);

    const inputWrapper = screen.getByTestId('inputWrapper');
    const error = screen.getByText('random error');

    expect(inputWrapper).toContainElement(error);
  });

  it('passes ref', () => {
    const ref = { current: null };
    render(<Input label="label" ref={ref} />);

    const input = screen.getByLabelText('label');

    expect(ref.current).toBe(input);
  });

  it('renders block input', () => {
    render(<Input label="label" block />);

    const wrapper = screen.getByTestId('wrapper');

    expect(wrapper).toHaveClass(styles.block);
  });
});
