import { FunctionComponent, SVGProps } from 'react';

type StageType = 'preparation' | 'progress' | 'reveal';

type SVGType = FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;

export type { StageType, SVGType };
