import { ProviderProps } from 'react';

type Props = Omit<ProviderProps<never>, 'value'>;

export type { Props };
