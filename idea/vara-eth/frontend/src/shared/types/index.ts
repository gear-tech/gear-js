import { FunctionComponent, SVGProps } from 'react';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export type PropsWithClassName = {
  className?: string;
};

export type SVGComponent = FunctionComponent<
  SVGProps<SVGSVGElement> & { title?: string; titleId?: string; desc?: string; descId?: string }
>;
