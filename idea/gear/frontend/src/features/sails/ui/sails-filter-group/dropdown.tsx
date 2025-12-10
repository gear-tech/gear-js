import { Combobox } from '@base-ui-components/react';
import { Button, Input } from '@gear-js/ui';
import { Ref, useState } from 'react';

import { cx } from '@/shared/helpers';

import styles from './dropdown.module.scss';

type Props = {
  label: string;
  groups: { value: string; items: string[] }[];
  value: string;
  inputProps: { ref: Ref<HTMLInputElement>; onBlur: Combobox.Input.Props['onBlur'] };
  onChange: (value: string) => void;
};

const getParsedValue = (value: string) => {
  const [group, item = ''] = value.split('.');

  return { group, item };
};

function Dropdown({ label, groups, value, inputProps, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const current = getParsedValue(value);

  const renderItem = (_item: string) => {
    const { item } = getParsedValue(_item);

    if (!item) return;

    return (
      <Combobox.Item key={_item} value={_item} className={styles.item}>
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
          {group.value}

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

  const getDisplayInputValue = (_value: string) => {
    if (!_value) return '';

    const { group, item } = getParsedValue(_value);

    return item ? `${item} (${group})` : `${group} (all)`;
  };

  return (
    <Combobox.Root
      items={groups}
      value={value}
      onValueChange={(_value) => onChange(_value || '')}
      open={isOpen}
      onOpenChange={setIsOpen}
      itemToStringLabel={getDisplayInputValue}>
      <Combobox.Input
        placeholder="Select"
        render={<Input direction="y" label={label} />}
        className={styles.input}
        {...inputProps}
      />

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className={styles.positioner}>
          <Combobox.Popup className={styles.popup}>
            <Combobox.Empty>No {label.toLowerCase()} found.</Combobox.Empty>
            <Combobox.List className={styles.list}>{renderGroup}</Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

export { Dropdown };
