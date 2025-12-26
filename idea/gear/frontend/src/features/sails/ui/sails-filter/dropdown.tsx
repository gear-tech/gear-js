import { Combobox } from '@base-ui/react';
import { Button } from '@gear-js/ui';
import { Ref, useId, useState } from 'react';
import SimpleBar from 'simplebar-react';

import ArrowSVG from '@/shared/assets/images/actions/arrowRight.svg?react';
import { cx } from '@/shared/helpers';

import { getParsedFilterValue } from '../../utils';

import styles from './dropdown.module.scss';

type Props = {
  label: string;
  groups: { value: string; items: string[] }[];
  value: string;
  inputProps: { ref: Ref<HTMLInputElement>; onBlur: Combobox.Input.Props['onBlur'] };
  onChange: (value: string) => void;
};

const getDisplayInputValue = (value: string) => {
  if (!value) return '';

  const { group, item } = getParsedFilterValue(value);

  return item ? `${item} (${group})` : `${group} (all)`;
};

const getShortestItems = (groups: { value: string; items: string[] }[]) =>
  groups
    .flatMap((group) => group.items)
    .map((item) => getParsedFilterValue(item).item)
    .filter((item) => Boolean(item))
    .sort((a, b) => a.length - b.length)
    .slice(0, 3)
    .join(', ');

function Dropdown({ label, groups, value, inputProps, onChange }: Props) {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  const current = getParsedFilterValue(value);

  const renderItem = (_item: string) => {
    const { item } = getParsedFilterValue(_item);

    if (!item) return;

    return (
      <Combobox.Item key={_item} value={_item} title={item} className={styles.item}>
        {item}
      </Combobox.Item>
    );
  };

  const renderGroup = (group: (typeof groups)[number]) => {
    const isSelected = current.group === group.value && !current.item;

    const handleClick = () => {
      onChange(group.value);
      setIsOpen(false);
    };

    return (
      <Combobox.Group key={group.value} items={group.items} className={cx(styles.group, isSelected && styles.selected)}>
        <Combobox.GroupLabel className={styles.groupLabel}>
          <span className={styles.heading} title={group.value}>
            {group.value}
          </span>

          <Button
            text={isSelected ? 'Selected' : 'Select All'}
            color={isSelected ? 'lightGreen' : 'light'}
            size="small"
            onClick={handleClick}
            className={styles.selectAllButton}
            noWrap
          />
        </Combobox.GroupLabel>

        <Combobox.Collection>{renderItem}</Combobox.Collection>
      </Combobox.Group>
    );
  };

  return (
    <Combobox.Root
      items={groups}
      value={value}
      onValueChange={(_value) => onChange(_value || '')}
      open={isOpen}
      onOpenChange={setIsOpen}
      itemToStringLabel={getDisplayInputValue}>
      <div>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>

        <Combobox.Trigger id={id} className={cx(styles.trigger, styles.normal, styles.dark)}>
          <Combobox.Value>
            {value ? (
              getDisplayInputValue(value)
            ) : (
              <span className={styles.placeholder}>{getShortestItems(groups)}...</span>
            )}
          </Combobox.Value>

          <Combobox.Icon render={<ArrowSVG />} className={styles.icon} />
        </Combobox.Trigger>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={8} className={styles.positioner}>
          <Combobox.Popup className={styles.popup}>
            <Combobox.Empty className={styles.empty}>No {label.toLowerCase()} found.</Combobox.Empty>

            <Combobox.List
              render={({ children, ...props }) => (
                // without div wrapper simplebar errors
                <div {...props}>
                  <SimpleBar className={styles.simplebar}>{children}</SimpleBar>
                </div>
              )}>
              {renderGroup}
            </Combobox.List>

            <footer className={styles.inputContainer}>
              {/* TODO: @gear-js/ui input has some problems with refs */}
              <Combobox.Input placeholder="Search..." className={styles.input} {...inputProps} />
            </footer>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export { Dropdown };
