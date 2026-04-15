import { useAppKit } from '@reown/appkit/react';
import { type MouseEvent, useState } from 'react';
import type { Sails } from 'sails-js';
import { useAccount } from 'wagmi';

import ArrowSVG from '@/assets/icons/arrow-square-down.svg?react';
import { Button, SplitButton, Tooltip } from '@/components';
import { cx } from '@/shared/utils';

import type { FormattedPayloadValue, SailsAction as SailsActionType } from '../../lib';
import { SailsPayloadForm } from '../sails-payload-form';

import styles from './sails-action.module.scss';

type Props = SailsActionType & {
  sails: Sails;
};

const SailsAction = ({
  id,
  name,
  action,
  sails,
  args,
  isEnabled = true,
  tooltip,
  encode,
  onSubmit,
  splitAction,
  requiresAccount = true,
}: Props) => {
  const account = useAccount();
  const { open } = useAppKit();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmpty = args.length === 0;
  const isSplitAction = Boolean(splitAction);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!isOpen && !isEmpty) {
      // prevent submit, somehow react updates state before event is finished,
      // therefore using type={isOpen ? 'button' : 'submit'} not works
      event.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSubmit = async (payload: FormattedPayloadValue) => {
    if (requiresAccount && !account.address) return open();

    setIsSubmitting(true);

    return onSubmit(payload).finally(() => setIsSubmitting(false));
  };

  const buttonProps = {
    type: 'submit' as const,
    variant: 'default' as const,
    size: 'xs' as const,
    isLoading: isSubmitting,
    disabled: !isEnabled,
    form: id,
    children: action,
  };

  const handleSplitOptionClick = (value: string) => {
    if (!splitAction) return;

    splitAction.onOptionClick(value);
  };

  const renderActionButton = () => {
    if (!isSplitAction || !splitAction) {
      return <Button {...buttonProps} onClick={handleClick} />;
    }

    return (
      <SplitButton
        className={styles.splitButton}
        options={splitAction.options}
        selectedValue={splitAction.selectedValue}
        disabled={!isEnabled}
        isLoading={isSubmitting}
        primaryButtonProps={{
          type: 'submit',
          form: id,
          onClick: handleClick,
        }}
        onOptionClick={handleSplitOptionClick}>
        {action}
      </SplitButton>
    );
  };

  // TODO: ExpandableItem component? it's not flexible though
  if (isEmpty)
    return (
      <div className={styles.container}>
        <header className={cx(styles.header, styles.empty)}>
          <ArrowSVG className={styles.arrow} />
          <span className={styles.title}>{name}</span>

          <Tooltip value={tooltip} showOnDisabledTrigger>
            {renderActionButton()}
          </Tooltip>
        </header>

        <SailsPayloadForm id={id} sails={sails} args={args} encode={encode} onSubmit={handleSubmit} />
      </div>
    );

  return (
    <div className={styles.container}>
      {/* biome-ignore lint/a11y: keyboard handling is provided by button inside the header */}
      <header className={cx(styles.header, isOpen && styles.open)} onClick={() => setIsOpen((prevValue) => !prevValue)}>
        <ArrowSVG className={styles.arrow} />
        <span className={styles.title}>{name}</span>

        <Tooltip value={tooltip} showOnDisabledTrigger>
          {renderActionButton()}
        </Tooltip>
      </header>

      {isOpen && (
        <div className={styles.body}>
          <SailsPayloadForm id={id} sails={sails} args={args} encode={encode} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
};

export { SailsAction };
