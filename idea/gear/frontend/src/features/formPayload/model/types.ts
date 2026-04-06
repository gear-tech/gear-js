import type { ReactNode } from 'react';

import type { PayloadValue, TypeStructure } from '@/entities/formPayload';

type FormPayloadValues = {
  payload: PayloadValue;
  // TODO(#1737): fix any
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

export type { FormPayloadValues, PayloadItemProps, PayloadStructureProps };
