import { useAccount, useAlert, useApi } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useModalState } from '@/hooks';
import { GENESIS, TURNSTILE_SITEKEY } from '@/shared/config';
import { cx } from '@/shared/helpers';

import GiftSVG from '../../assets/gift.svg?react';
import { createMainnetClaim, getMainnetChallenge, getMainnetClaim, type MainnetChallenge, type MainnetClaim } from '../../api';
import styles from '../get-test-balance/get-test-balance.module.scss';

const OVERLAY_ROOT_ID = 'mainnet-faucet-verification-overlay-root';
const DEVICE_TOKEN_KEY = 'vara-mainnet-faucet-device-token';
const FINAL_STATUSES = new Set(['finalized', 'rejected', 'failed_terminal', 'reconciliation_required']);
const MAINNET_FAUCET_ERROR_MESSAGES: Record<string, string> = {
  wallet_limit_reached: 'Mainnet faucet limit reached for this wallet.',
  device_limit_reached: 'Mainnet faucet limit reached for this browser or device.',
  network_limit_reached: 'Mainnet faucet limit reached for this network. Please try again later.',
  faucet_capacity_reached: 'Mainnet faucet daily limit reached. Please try again later.',
  verification_required: 'Please complete verification and try again.',
  verification_failed: 'Human verification failed. Please try again.',
  verification_unavailable: 'Human verification is temporarily unavailable. Please try again later.',
  invalid_challenge: 'This faucet request expired. Please try again.',
  invalid_signature: 'Wallet signature was rejected. Please try again.',
  invalid_address: 'Selected wallet address is not valid.',
  invalid_request: 'Mainnet faucet request is invalid. Please try again.',
  idempotency_conflict: 'This faucet request is already being processed. Please try again.',
  rate_limited: 'Too many faucet requests. Please wait a minute and try again.',
  temporarily_unavailable: 'Mainnet faucet is temporarily paused. Please try again later.',
  server_misconfigured: 'Mainnet faucet is temporarily unavailable. Please contact support.',
  not_eligible: 'This request cannot be completed by the mainnet faucet.',
};

type PendingClaim = {
  challenge: MainnetChallenge;
  signature: string;
};

type VerificationOverlayProps = {
  isVisible: boolean;
  children: ReactNode;
};

function VerificationOverlay({ isVisible, children }: VerificationOverlayProps) {
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById(OVERLAY_ROOT_ID);

    if (!root) {
      root = document.createElement('div');
      root.id = OVERLAY_ROOT_ID;

      document.body.append(root);
    }

    setOverlayRoot(root);

    return () => {
      root?.remove();
    };
  }, []);

  const overlay = <div className={cx(styles.overlay, isVisible && styles.active)}>{children}</div>;

  return overlayRoot ? createPortal(overlay, overlayRoot) : overlay;
}

function GetMainnetBalance() {
  const { api } = useApi();
  const { account } = useAccount();
  const alert = useAlert();
  const turnstileRef = useRef<TurnstileInstance>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isVerificationVisible, openVerification, closeVerification] = useModalState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingClaim, setPendingClaim] = useState<PendingClaim | null>(null);

  const genesis = api?.genesisHash.toHex();
  const isMainnet = genesis === GENESIS.MAINNET;

  useEffect(
    () => () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (!isSubmitting || !pendingClaim || !TURNSTILE_SITEKEY) return;

    turnstileRef.current?.reset();
    turnstileRef.current?.execute();
  }, [isSubmitting, pendingClaim]);

  const settleVerification = () => {
    closeVerification();
  };

  const handleClick = async () => {
    try {
      if (!account) throw new Error('Account is not found');
      if (!account.signer?.signRaw) throw new Error('Selected wallet does not support raw signing');

      setIsSubmitting(true);

      const challenge = await getMainnetChallenge(account.address);
      const signatureResult = await account.signer.signRaw({
        address: account.address,
        data: challenge.messageHex,
        type: 'bytes',
      });

      if (!signatureResult.signature) throw new Error('Wallet did not return a signature');

      const nextPendingClaim = { challenge, signature: signatureResult.signature };
      setPendingClaim(nextPendingClaim);

      if (TURNSTILE_SITEKEY) return;

      await submitClaim(nextPendingClaim, 'disabled');
    } catch (error) {
      setIsSubmitting(false);
      alert.error(getPublicError(error));
    }
  };

  const handleVerificationSuccess = (token: string) => {
    if (!pendingClaim) return;

    settleVerification();

    submitClaim(pendingClaim, token).catch((error) => {
      setIsSubmitting(false);
      alert.error(getPublicError(error));
    });
  };

  const handleVerificationError = (code: string) => {
    settleVerification();
    setIsSubmitting(false);

    alert.error(`Error verifying that you are a human, code: ${code}. Please try again.`);
  };

  const submitClaim = async ({ challenge, signature }: PendingClaim, turnstileToken: string) => {
    if (!account) throw new Error('Account is not found');

    const claim = await createMainnetClaim({
      address: account.address,
      challengeId: challenge.challengeId,
      signature,
      turnstileToken,
      deviceToken: getDeviceToken(),
      idempotencyKey: crypto.randomUUID(),
    });

    handleClaimStatus(claim);
    setPendingClaim(null);
    setIsSubmitting(false);

    if (claim.claimId && !FINAL_STATUSES.has(claim.status)) {
      alert.success('Mainnet faucet claim submitted. Waiting for payout...');
      pollClaim(claim.claimId);
    }
  };

  const pollClaim = (claimId: string) => {
    if (pollTimerRef.current) clearTimeout(pollTimerRef.current);

    pollTimerRef.current = setTimeout(() => {
      getMainnetClaim(claimId)
        .then((claim) => {
          handleClaimStatus(claim);

          if (!FINAL_STATUSES.has(claim.status)) pollClaim(claimId);
        })
        .catch((error) => alert.error(getPublicError(error)));
    }, 4000);
  };

  const handleClaimStatus = (claim: MainnetClaim) => {
    if (claim.status === 'finalized') {
      alert.success(`Mainnet balance sent${claim.transactionHash ? `: ${claim.transactionHash}` : ''}`);
      return;
    }

    if (claim.status === 'rejected') {
      alert.error(getMainnetFaucetMessage(claim.reasonCode));
      return;
    }

    if (claim.status === 'failed_terminal') {
      alert.error('Mainnet faucet payout failed. Please contact support.');
      return;
    }

    if (claim.status === 'reconciliation_required') {
      alert.error('Mainnet faucet payout needs operator review.');
    }
  };

  if (!isMainnet) return null;

  return (
    <>
      <Button
        icon={GiftSVG}
        text="Get Mainnet Balance"
        color="secondary"
        size="small"
        onClick={handleClick}
        disabled={isSubmitting}
        noWrap
      />

      {TURNSTILE_SITEKEY && (
        <VerificationOverlay isVisible={isVerificationVisible}>
          <Turnstile
            options={{
              execution: 'execute',
              appearance: 'interaction-only',
              action: 'mainnet_faucet_claim',
              cData: pendingClaim?.challenge.challengeId,
            }}
            siteKey={TURNSTILE_SITEKEY}
            ref={turnstileRef}
            onBeforeInteractive={openVerification}
            onAfterInteractive={settleVerification}
            onError={handleVerificationError}
            onSuccess={handleVerificationSuccess}
          />
        </VerificationOverlay>
      )}
    </>
  );
}

function getDeviceToken() {
  let token = localStorage.getItem(DEVICE_TOKEN_KEY);

  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
  }

  return token;
}

function getPublicError(error: unknown) {
  if (error instanceof Error) return getMainnetFaucetMessage(error.message);

  return 'Mainnet faucet request failed';
}

function getMainnetFaucetMessage(code?: string) {
  if (!code) return 'Mainnet faucet request failed';

  return MAINNET_FAUCET_ERROR_MESSAGES[code] ?? 'Mainnet faucet request failed. Please try again.';
}

export { GetMainnetBalance };
