import { HexString } from '@gear-js/api';
import { Button, Input, Modal } from '@gear-js/ui';
import { Identicon } from '@polkadot/react-identicon';
import { useState } from 'react';

import PlusSVG from '@/shared/assets/images/actions/plus.svg?react';
import RemoveSVG from '@/shared/assets/images/actions/remove.svg?react';
import { getShortName } from '@/shared/helpers';
import { Box, ConfirmModal } from '@/shared/ui';

import { useAccountRole, useVftRoles } from '../../hooks';

import styles from './vft-roles.module.scss';

type Props = {
  id: HexString | undefined;
};

function GrantRoleModal({ close }: { close: () => void }) {
  return (
    <Modal heading="Grant Role" close={close}>
      <Input label="To" direction="y" className={styles.input} />

      <Button text="Submit" block />
    </Modal>
  );
}

function VftRoles({ id }: Props) {
  const { admins, minters, burners } = useVftRoles(id);
  const { isAdmin } = useAccountRole(id);

  const [isGrantRoleModalOpen, setIsGrantRoleModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const renderRoles = (addresses: HexString[]) => {
    if (!addresses || addresses.length === 0) {
      return <li className={styles.emptyState}>No addresses</li>;
    }

    return addresses.map((address) => (
      <li key={address} className={styles.addressItem}>
        <Identicon value={address} theme="polkadot" size={16} className={styles.identicon} />
        <span className={styles.address}>{getShortName(address, 12)}</span>

        {isAdmin && (
          <Button
            icon={RemoveSVG}
            color="transparent"
            onClick={() => setIsConfirmModalOpen(true)}
            className={styles.revokeButton}
          />
        )}
      </li>
    ));
  };

  return (
    <>
      <div className={styles.container}>
        <Box className={styles.roleCard}>
          <h3 className={styles.roleTitle}>Admins</h3>
          <ul className={styles.addressList}>{renderRoles(admins.data || [])}</ul>

          {isAdmin && (
            <Button
              icon={PlusSVG}
              size="small"
              onClick={() => setIsGrantRoleModalOpen(true)}
              className={styles.grantButton}
            />
          )}
        </Box>

        <Box className={styles.roleCard}>
          <h3 className={styles.roleTitle}>Minters</h3>
          <ul className={styles.addressList}>{renderRoles(minters.data || [])}</ul>

          {isAdmin && (
            <Button
              icon={PlusSVG}
              size="small"
              onClick={() => setIsGrantRoleModalOpen(true)}
              className={styles.grantButton}
            />
          )}
        </Box>

        <Box className={styles.roleCard}>
          <h3 className={styles.roleTitle}>Burners</h3>
          <ul className={styles.addressList}>{renderRoles(burners.data || [])}</ul>

          {isAdmin && (
            <Button
              icon={PlusSVG}
              size="small"
              onClick={() => setIsGrantRoleModalOpen(true)}
              className={styles.grantButton}
            />
          )}
        </Box>
      </div>

      {isConfirmModalOpen && (
        <ConfirmModal
          title="Revoke Role"
          text="Role will be revoked from this address. Are you sure?"
          close={() => setIsConfirmModalOpen(false)}
          onSubmit={() => {}}
        />
      )}

      {isGrantRoleModalOpen && <GrantRoleModal close={() => setIsGrantRoleModalOpen(false)} />}
    </>
  );
}

export { VftRoles };
