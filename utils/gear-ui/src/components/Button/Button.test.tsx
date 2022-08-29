import { render, screen } from '@testing-library/react';
import { Button } from './Button';
import styles from './Button.module.scss';

const arrowIcon = 'icon-path';

// describe('button tests', () => {
//   it('renders button', () => {
//     render(<Button text="button text" />);

//     const button = screen.getByRole('button');

//     expect(button).toHaveTextContent('button text');
//     expect(button).toHaveAttribute('type', 'button');
//   });

//   it('render submit button', () => {
//     render(<Button type="submit" text="button text" />);

//     const button = screen.getByRole('button');

//     expect(button).toHaveTextContent('button text');
//     expect(button).toHaveAttribute('type', 'submit');
//   });

//   it('renders icon button', () => {
//     render(<Button icon={arrowIcon} />);

//     const button = screen.getByRole('button');
//     const icon = screen.getByRole('img');

//     expect(button).toContainElement(icon);
//     expect(button).toHaveClass(styles.noText);
//   });

//   it('renders button with icon and text', () => {
//     render(<Button text="button text" icon={arrowIcon} />);

//     const button = screen.getByText('button text');
//     const icon = screen.getByRole('img');

//     expect(button).toContainElement(icon);
//     expect(button).toHaveClass(styles.normal);
//   });

//   it('renders small button with secondary and tertiary color', () => {
//     const { rerender } = render(<Button text="button text" color="secondary" size="small" />);

//     const button = screen.getByRole('button');
//     expect(button).toHaveClass(styles.secondary, styles.small);

//     rerender(<Button text="button text" color="tertiary" size="small" />);
//     expect(button).toHaveClass(styles.tertiary, styles.small);
//   });

//   it('renders button with transparent background', () => {
//     render(<Button text="button text" color="transparent" />);
//     const button = screen.getByRole('button');
//     expect(button).toHaveClass(styles.transparent);
//   });

//   it('renders no wrap block button', () => {
//     render(<Button text="button text" block noWrap />);
//     const button = screen.getByRole('button');
//     expect(button).toHaveClass(styles.block, styles.noWrap);
//   });

//   it('passes ref', () => {
//     const ref = { current: null };
//     render(<Button text="button text" ref={ref} />);

//     const button = screen.getByRole('button');

//     expect(ref.current).toBe(button);
//   });
// });
