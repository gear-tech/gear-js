import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  useId,
  FunctionComponent,
  SVGProps,
  useState,
  useEffect,
} from 'react';
import cx from 'clsx';
import styles from './input.module.scss';
import type { IInputSizes } from './helpers.ts';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'size'> & {
  icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  size?: IInputSizes;
  label?: string;
  error?: ReactNode;
  block?: boolean;
};

function useWidth() {
  const [width, setWidth] = useState(0);
  const id = useId();

  useEffect(() => {
    // not using ref to get node, because forwardRef for svg disabled in svgr by default
    const node = document.getElementById(id);

    if (!node) return;

    setWidth(node.getBoundingClientRect().width);
  }, [id]);

  return [width, id] as const;
}

const Input = forwardRef<HTMLInputElement, Props>(
  (
    { icon: Icon, className, label, error, type = 'text', placeholder = ' ', size = 'default', block, ...attrs },
    ref,
  ) => {
    const { disabled } = attrs;

    const id = useId();

    // TODO: find a better way to display icon
    // input, label and fieldset should have the same parent to detect input's state,
    // therefore label requires position absolute
    const [iconWidth, iconId] = useWidth();
    const padding = 14;
    const gap = 8;
    const labelStyle = { left: `${iconWidth ? padding + gap + iconWidth : padding}px` };

    return (
      <div className={cx(styles.root, className, disabled && styles.disabled, block && styles.block)}>
        <div className={cx(styles.base, styles[size])}>
          {Icon && <Icon id={iconId} />}

          <input
            type={type}
            id={id}
            className={cx(styles.input, styles[size], error && styles.error)}
            placeholder={placeholder}
            ref={ref}
            disabled={disabled}
            {...attrs}
          />

          {label && (
            <label htmlFor={id} className={cx(styles.label, styles[size])} style={labelStyle}>
              {label}
            </label>
          )}

          <fieldset className={styles.fieldset}>
            <legend className={cx(styles.legend, label && styles.legendLabel)}>{label}&#8203;</legend>
          </fieldset>
        </div>

        {error && <p className={styles.message}>{error}</p>}
      </div>
    );
  },
);

export { Input };
export type { Props as InputProps };
