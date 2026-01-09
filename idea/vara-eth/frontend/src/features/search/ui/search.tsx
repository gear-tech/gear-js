import { getBytecode } from '@wagmi/core';
import { FormEvent } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { isAddress, isHash } from 'viem';
import { useConfig } from 'wagmi';

import SearchSVG from '@/assets/icons/search.svg?react';
import { Button } from '@/components';
import { getCode } from '@/features/codes/lib/requests';
import { getMessageRequests, getMessageSent } from '@/features/messages/lib/requests';
import { routes } from '@/shared/config';
import { noop } from '@/shared/utils';

import styles from './search.module.scss';

const Search = () => {
  const navigate = useNavigate();
  const config = useConfig();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const value = (formData.get('search') as string).trim();

    if (!value) return;

    if (isAddress(value)) {
      const bytecode = await getBytecode(config, { address: value });

      return bytecode
        ? navigate(generatePath(routes.program, { programId: value }))
        : navigate(generatePath(routes.user, { userId: value }));
    }

    if (isHash(value)) {
      const code = await getCode(value).catch(noop);

      // TODO: pass state to avoid double fetch
      if (code) return navigate(generatePath(routes.code, { codeId: value }));

      const messageRequests = await getMessageRequests(value).catch(noop);

      if (messageRequests) return navigate(generatePath(routes.message.requests, { messageId: value }));

      const messageSent = await getMessageSent(value).catch(noop);

      if (messageSent) return navigate(generatePath(routes.message.sent, { messageId: value }));
    }

    navigate(generatePath(routes.notFound));
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search by code id, program id, message id, wallet address..."
        name="search"
        className={styles.input}
      />

      <Button type="submit" variant="icon">
        <SearchSVG />
      </Button>
    </form>
  );
};

export { Search };
