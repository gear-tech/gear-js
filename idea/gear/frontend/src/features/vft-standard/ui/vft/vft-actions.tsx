import { Menu } from '@base-ui-components/react/menu';
import { Button, Input, Modal } from '@gear-js/ui';
import * as React from 'react';
import { useState } from 'react';

import styles from './vft-actions.module.scss';

const ACTIONS = [
  { label: 'Burn' },
  { label: 'Mint' },
  { label: 'Transfer' },
  { label: 'Transfer From' },
  { label: 'Approve' },
  { label: 'Grant Role' },
  { label: 'Revoke Role' },
];

const READS = [{ label: 'Balance Of' }, { label: 'Allowance' }];

type MenuProps = {
  triggerText: string;
  items: { label: string; onClick: () => void }[];
};

function ExampleMenu({ triggerText, items }: MenuProps) {
  const renderItems = () =>
    items.map((item) => (
      <Menu.Item key={item.label} className={styles.Item} render={<button type="button" />} onClick={item.onClick}>
        {item.label}
      </Menu.Item>
    ));

  return (
    <Menu.Root>
      <Menu.Trigger className={styles.Button}>
        {triggerText} <ChevronDownIcon className={styles.ButtonIcon} />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner className={styles.Positioner} sideOffset={8}>
          <Menu.Popup className={styles.Popup}>
            <Menu.Arrow className={styles.Arrow}>
              <ArrowSvg />
            </Menu.Arrow>

            {renderItems()}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className={styles.ArrowFill}
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className={styles.ArrowOuterStroke}
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className={styles.ArrowInnerStroke}
      />
    </svg>
  );
}

function ChevronDownIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M1 3.5L5 7.5L9 3.5" stroke="currentcolor" strokeWidth="1.5" />
    </svg>
  );
}

function PlaceholderModal({ close }: { close: () => void }) {
  return (
    <Modal heading="VFT Action" close={close} className={styles.modal}>
      <div>
        <Input label="From" gap="1/5" />
        <Input label="To" gap="1/5" />
        <Input label="Value" gap="1/5" />
      </div>

      <Button text="Submit" block />
    </Modal>
  );
}

function VftActions() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ExampleMenu
        triggerText="Actions"
        items={ACTIONS.map((action) => ({ label: action.label, onClick: () => setIsModalOpen(true) }))}
      />

      {isModalOpen && <PlaceholderModal close={() => setIsModalOpen(false)} />}
    </>
  );
}

function VftReads() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ExampleMenu
        triggerText="Read"
        items={READS.map((read) => ({ label: read.label, onClick: () => setIsModalOpen(true) }))}
      />

      {isModalOpen && <PlaceholderModal close={() => setIsModalOpen(false)} />}
    </>
  );
}

export { VftActions, VftReads };
