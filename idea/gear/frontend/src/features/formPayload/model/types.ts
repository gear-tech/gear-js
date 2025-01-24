import { ReactNode } from 'react';

import { TypeStructure, PayloadValue } from '@/entities/formPayload';

type FormPayloadValues = {
  payload: PayloadValue;
  // TODO(#1737): fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manualPayload: any;
  typeStructure: TypeStructure;
};

type PayloadStructureProps = {
  title?: string;
  levelName: string;
  typeStructure: TypeStructure;
};

type PayloadItemProps = PayloadStructureProps & {
  renderNextItem: (props: PayloadStructureProps) => ReactNode;
};

export type { PayloadItemProps, PayloadStructureProps, FormPayloadValues };
