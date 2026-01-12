import { zodResolver } from '@hookform/resolvers/zod';
import { Config, getBytecode } from '@wagmi/core';
import { useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { isAddress, isHash } from 'viem';
import { useConfig } from 'wagmi';
import { z } from 'zod';

import SearchSVG from '@/assets/icons/search.svg?react';
import { Button } from '@/components';
import { getCode } from '@/features/codes/lib/requests';
import { routes } from '@/shared/config';
import { noop } from '@/shared/utils';

import styles from './search.module.scss';

const FIELD_NAME = 'value';
const DEFAULT_VALUES = { [FIELD_NAME]: '' };
const CHAIN_ENTITY = { PROGRAM: 'program', USER: 'user', CODE: 'code', UNKNOWN: 'unknown' } as const;

const getChainEntity = async (wagmiConfig: Config, id: string) => {
  if (isAddress(id)) {
    const bytecode = await getBytecode(wagmiConfig, { address: id });

    return bytecode ? { kind: CHAIN_ENTITY.PROGRAM, id } : { kind: CHAIN_ENTITY.USER, id };
  }

  if (isHash(id)) {
    const code = await getCode(id).catch(noop);

    if (code) return { kind: CHAIN_ENTITY.CODE, state: code, id };
  }

  return { kind: CHAIN_ENTITY.UNKNOWN };
};

const getSchema = (wagmiConfig: Config) =>
  z
    .object({
      [FIELD_NAME]: z
        .string()
        .trim()
        .toLowerCase()
        .refine((value) => isAddress(value) || isHash(value), { message: 'Invalid address or hash' }),
    })
    .transform(({ value }) => getChainEntity(wagmiConfig, value));

type Values = typeof DEFAULT_VALUES;
type FormattedValues = z.infer<ReturnType<typeof getSchema>>;

const Search = () => {
  const navigate = useNavigate();

  const config = useConfig();
  const schema = getSchema(config);

  const { register, formState, ...form } = useForm<Values, unknown, FormattedValues>({
    defaultValues: DEFAULT_VALUES,
    resolver: zodResolver(schema),
  });

  const error = formState.errors[FIELD_NAME]?.message;

  const handleSubmit = ({ kind, id, state }: FormattedValues) => {
    switch (kind) {
      case CHAIN_ENTITY.PROGRAM:
        return navigate(generatePath(routes.program, { programId: id }));
      case CHAIN_ENTITY.USER:
        return navigate(generatePath(routes.user, { userId: id }));
      case CHAIN_ENTITY.CODE:
        // TODO: support state at code page
        return navigate(generatePath(routes.code, { state, codeId: id }));
      default:
        navigate(generatePath(routes.notFound));
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

      <Button type="submit" variant="icon">
        <SearchSVG />
      </Button>
    </form>
  );
};

export { Search };
