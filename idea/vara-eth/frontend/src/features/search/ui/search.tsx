import { zodResolver } from '@hookform/resolvers/zod';
import { HexString } from '@vara-eth/api';
import { getBytecode } from '@wagmi/core';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { isAddress, isHash } from 'viem';
import { useConfig } from 'wagmi';
import { z } from 'zod';

import SearchSVG from '@/assets/icons/search.svg?react';
import { Button } from '@/components';
import { routes } from '@/shared/config';
import { noop } from '@/shared/utils';

import { getIndexerEntity, INDEXER_ENTITY } from '../lib';

import styles from './search.module.scss';

const FIELD_NAME = 'value';
const DEFAULT_VALUES = { [FIELD_NAME]: '' };

const SCHEMA = z.object({
  [FIELD_NAME]: z
    .string()
    .trim()
    .toLowerCase()
    .refine((value) => isAddress(value) || isHash(value), { message: 'Invalid address or hash' }),
});

type Values = typeof DEFAULT_VALUES;
type FormattedValues = z.infer<typeof SCHEMA>;

const Search = () => {
  const navigate = useNavigate();
  const config = useConfig();

  const { formState, register, ...form } = useForm<Values, unknown, FormattedValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(SCHEMA),
  });

  const { errors, isSubmitting } = formState;
  const error = errors[FIELD_NAME]?.message;

  const isWalletAddress = async (value: HexString) => {
    if (!isAddress(value)) return false;

    return getBytecode(config, { address: value })
      .then((result) => !result)
      .catch((_error) => {
        console.error(
          "Can't determine whether address is a contract during search request. Assuming it might be.",
          _error,
        );

        return false;
      });
  };

  const handleSubmit = async ({ value }: FormattedValues) => {
    if (await isWalletAddress(value)) return navigate(generatePath(routes.user, { userId: value }));

    // TODO: implement indexer error type and noop only 404 to handle other errors
    const { type } = (await getIndexerEntity(value).catch(noop)) || {};

    switch (type) {
      case INDEXER_ENTITY.PROGRAM:
        return navigate(generatePath(routes.program, { programId: value }));

      case INDEXER_ENTITY.CODE:
        return navigate(generatePath(routes.code, { codeId: value }));

      case INDEXER_ENTITY.MESSAGE_REQUEST:
      case INDEXER_ENTITY.MESSAGE_SENT:
      case INDEXER_ENTITY.REPLY_REQUEST:
      case INDEXER_ENTITY.REPLY_SENT:
        return navigate(generatePath(routes.message, { messageId: value }));

      default:
        return navigate(generatePath(routes.notFound), { state: value });
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={form.handleSubmit(handleSubmit)}>
      <input
        type="text"
        placeholder="Search by code id, program id, wallet address..."
        className={styles.input}
        aria-invalid={Boolean(error)}
        {...register(FIELD_NAME)}
      />

      {error && <span className={styles.error}>{error}</span>}

      <Button type="submit" variant="icon" isLoading={isSubmitting}>
        <SearchSVG />
      </Button>
    </form>
  );
};

export { Search };
