import { STATUS_CODES } from 'http';

import { HexString } from '@gear-js/api';
import { useAlert } from '@gear-js/react-hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getDockerImageVersions, getVerificationStatus, getVerifiedCode, verifyCode } from './requests';

function useVerifyCode() {
  return useMutation({
    mutationKey: ['verify-code'],
    mutationFn: verifyCode,
  });
}

function useIsCodeVerified(codeId: HexString | null | undefined) {
  const alert = useAlert();

  const query = useQuery({
    queryKey: ['code-verification-status', codeId],

    queryFn: () =>
      getVerifiedCode(codeId!)
        .then((result) => Boolean(result))
        .catch((error: Error) => {
          if (error.message === STATUS_CODES[404]) return false;

          throw error;
        }),

    enabled: Boolean(codeId),
  });

  const { error } = query;

  useEffect(() => {
    if (error) alert.error(error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return query;
}

function useVerificationStatus(id: string) {
  const alert = useAlert();

  const query = useQuery({
    queryKey: ['verification-status', id],
    queryFn: () => getVerificationStatus(id),
  });

  const { error } = query;

  useEffect(() => {
    if (error) alert.error(error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return query;
}

function useDockerImageVersions() {
  const alert = useAlert();

  const query = useQuery({
    queryKey: ['docker-image-versions'],
    queryFn: getDockerImageVersions,
  });

  const { error } = query;

  useEffect(() => {
    if (error) alert.error(error.message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return query;
}

export { useVerifyCode, useIsCodeVerified, useVerificationStatus, useDockerImageVersions };
