import { ReactNode } from 'react';

import { TypeStructure, PayloadValue } from 'entities/formPayload';

type FormPayloadValues = {
  payload: PayloadValue;
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
