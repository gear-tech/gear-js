import { Combobox } from '@base-ui-components/react/combobox';
import { useId, useState } from 'react';
import { useController, useFormContext, Path } from 'react-hook-form';

import { cx } from '@/shared/helpers';

import { Services } from '../../types';

import styles from './dropdown.module.scss';

type FieldValues<T> = T & {
  sailsFunction: string;
};

type Props<T> = {
  heading: string;
  services: Services;
  type: 'functions' | 'events';
  name: Path<FieldValues<T>>;
  onSubmit: (values: FieldValues<T>) => void;
};

const getGroups = (services: Services, type: 'functions' | 'events') =>
  Object.entries(services).map(([serviceName, service]) => ({
    value: serviceName,
    items: [serviceName, ...Object.keys(service[type]).map((item) => `${serviceName}.${item}`)],
  }));

const getParsedValue = (value: string) => {
  const [serviceName, functionName = ''] = value.split('.');

  return { serviceName, functionName };
};

function Dropdown<T>({ heading, services, type, name, onSubmit }: Props<T>) {
  const id = useId();

  const { handleSubmit } = useFormContext<FieldValues<T>>();
  const { field } = useController<FieldValues<T>>({ name });
  const { serviceName, functionName } = getParsedValue(field.value as string);

  const [isOpen, setIsOpen] = useState(false);

  const groups = getGroups(services, type);

  const handleChange = (value: string | null) => {
    field.onChange(value);
    void handleSubmit(onSubmit)();
  };

  const renderItem = (item: string) => {
    const parsed = getParsedValue(item);

    const isSelectedGroup = serviceName === parsed.serviceName && !functionName;

    if (!parsed.functionName) return;

    return (
      <Combobox.Item key={item} value={item} className={cx(styles.Item, isSelectedGroup && styles.selectedGroup)}>
        <Combobox.ItemIndicator className={styles.ItemIndicator}>
          <CheckIcon className={styles.ItemIndicatorIcon} />
        </Combobox.ItemIndicator>

        <div className={styles.ItemText}>{parsed.functionName}</div>
      </Combobox.Item>
    );
  };

  const renderGroup = (group: (typeof groups)[number]) => {
    const handleClick = () => {
      handleChange(group.value);
      setIsOpen(false);
    };

    return (
      <Combobox.Group key={group.value} items={group.items} className={styles.Group}>
        <Combobox.GroupLabel className={styles.GroupLabel}>
          {group.value}

          <button type="button" className={styles.GroupLabelButton} onClick={handleClick}>
            Select All
          </button>
        </Combobox.GroupLabel>

        <Combobox.Collection>{renderItem}</Combobox.Collection>
      </Combobox.Group>
    );
  };

  return (
    <Combobox.Root
      items={groups}
      value={field.value as string}
      onValueChange={(value) => handleChange(value || '')}
      open={isOpen}
      onOpenChange={setIsOpen}
      itemToStringLabel={(value) => getParsedValue(value).functionName || value}>
      <div className={styles.Label}>
        <label htmlFor={id}>{heading}</label>

        <div className={styles.InputWrapper}>
          <Combobox.Input placeholder="Select" id={id} className={styles.Input} ref={field.ref} onBlur={field.onBlur} />

          <div className={styles.ActionButtons}>
            <Combobox.Clear className={styles.Clear}>
              <ClearIcon className={styles.ClearIcon} />
            </Combobox.Clear>

            <Combobox.Trigger className={styles.Trigger}>
              <ChevronDownIcon className={styles.TriggerIcon} />
            </Combobox.Trigger>
          </div>
        </div>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner className={styles.Positioner} sideOffset={4}>
          <Combobox.Popup className={styles.Popup}>
            <Combobox.Empty className={styles.Empty}>No {heading.toLowerCase()} found.</Combobox.Empty>
            <Combobox.List className={styles.List}>{renderGroup}</Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

function CheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
    </svg>
  );
}

function ClearIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export { Dropdown };
