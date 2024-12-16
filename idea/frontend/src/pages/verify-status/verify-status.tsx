import { useAlert } from '@gear-js/react-hooks';
import { Button, Input } from '@gear-js/ui';
import { useLocation, useParams } from 'react-router-dom';

import CopySVG from '@/shared/assets/images/actions/copyGreen.svg?react';
import RefreshSVG from '@/features/code-verifier/assets/refresh.svg?react';
import { VerificationStatus } from '@/features/code-verifier';
import { Box, IdBlock, Table, TableRow } from '@/shared/ui';
import { copyToClipboard } from '@/shared/helpers';

import styles from './verify-status.module.scss';

type Params = {
  id: string;
};

type Location = {
  state:
    | ({
        build_idl: boolean;
        code_id: string;
        network: string;
        project: { Name: string } | { PathToCargoToml: string };
        repo_link: string;
        version: string;
      } & {
        created_at: string;
        failed_reason: string | null;
      })
    | null;
};

function VerifyStatus() {
  const { id } = useParams() as Params;
  const { state } = useLocation() as Location;
  const alert = useAlert();

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1 className={styles.heading}>Verify Code</h1>

          <VerificationStatus.Skeleton />
        </div>

        <Button icon={RefreshSVG} text="Check Status" color="secondary" onClick={() => {}} />
      </header>

      <Box className={styles.idBox}>
        <Input label="Verification ID" value={id} gap="4/6" readOnly />
        <Button icon={CopySVG} color="transparent" onClick={() => copyToClipboard(id, alert)} />
      </Box>

      {state && (
        <Table>
          <TableRow name="Created At">{new Date(state.created_at).toLocaleDateString()}</TableRow>

          {state.failed_reason && <TableRow name="Failure Reason">{state.failed_reason}</TableRow>}

          <TableRow name="Docker image version">{state.version}</TableRow>

          <TableRow name="Code hash">
            <IdBlock id={state.code_id} size="big" />
          </TableRow>

          <TableRow name="Repository link">
            <a href={state.repo_link} target="_blank" rel="noreferrer" className={styles.link}>
              test
            </a>
          </TableRow>

          <TableRow name="Project">
            {'Name' in state.project ? state.project.Name : state.project.PathToCargoToml}
          </TableRow>

          <TableRow name="Network ID">{state.network}</TableRow>
          <TableRow name="Build IDL">{state.build_idl}</TableRow>
        </Table>
      )}
    </>
  );
}

export { VerifyStatus };
