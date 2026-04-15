import { type ButtonHTMLAttributes, type ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import ArrowDownSVG from '@/assets/icons/arrow-square-down.svg?react';
import LoadingIcon from '@/assets/icons/loading.svg?react';
import { cx } from '@/shared/utils';

import styles from './split-button.module.scss';

type SplitButtonOption<TValue extends string> = {
  value: TValue;
  label: string;
  description?: string;
};

type Props<TValue extends string> = {
  options: readonly SplitButtonOption<TValue>[];
  selectedValue: TValue;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  menuClassName?: string;
  primaryButtonProps?: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'>;
  children: ReactNode;
  triggerAriaLabel?: string;
  onOptionClick: (value: TValue) => void;
};

const MENU_MIN_WIDTH = 254;
const VIEWPORT_OFFSET = 8;
const MENU_GAP = 6;

const SplitButton = <TValue extends string>({
  options,
  selectedValue,
  triggerAriaLabel = 'Select option',
  disabled,
  isLoading,
  className,
  menuClassName,
  primaryButtonProps,
  children,
  onOptionClick,
}: Props<TValue>) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const isDisabled = disabled || isLoading;

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInTrigger = rootRef.current?.contains(target);
      const isInMenu = menuRef.current?.contains(target);

      if (!isInTrigger && !isInMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const updateMenuPosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuHeight = menuRef.current?.offsetHeight ?? 220;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldOpenTop = spaceBelow < menuHeight + 8 && spaceAbove > spaceBelow;
      const top = shouldOpenTop ? Math.max(VIEWPORT_OFFSET, rect.top - menuHeight - MENU_GAP) : rect.bottom + MENU_GAP;
      const width = Math.max(MENU_MIN_WIDTH, rect.width);
      const left = Math.max(VIEWPORT_OFFSET, rect.right - width);

      setMenuPosition({
        top,
        left,
        width,
      });
    };

    updateMenuPosition();

    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);

    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [isOpen]);

  const handleOptionClick = (value: TValue) => {
    setIsOpen(false);
    onOptionClick(value);
  };

  return (
    <div className={cx(styles.container, className)} ref={rootRef}>
      <div className={cx(styles.buttonGroup, isOpen && styles.open)}>
        <button
          {...primaryButtonProps}
          type={primaryButtonProps?.type ?? 'button'}
          className={styles.primaryButton}
          disabled={isDisabled}
          aria-disabled={isDisabled}>
          {isLoading && <LoadingIcon className={styles.spinner} />}
          <span className={styles.content}>{children}</span>
        </button>

        <button
          type="button"
          className={styles.triggerButton}
          disabled={isDisabled}
          aria-label={triggerAriaLabel}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prevValue) => !prevValue)}>
          <ArrowDownSVG className={styles.arrow} />
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={cx(styles.menu, menuClassName)}
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              width: `${menuPosition.width}px`,
            }}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cx(styles.option, selectedValue === option.value && styles.selected)}
                onClick={() => handleOptionClick(option.value)}>
                <span className={styles.optionLabel}>{option.label}</span>
                {option.description && <span className={styles.optionDescription}>{option.description}</span>}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
};

export { SplitButton, type SplitButtonOption };
