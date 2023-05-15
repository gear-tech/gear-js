import { FunctionComponent, SVGProps } from 'react';

type Node = {
  isCustom: boolean;
  address: string;
  SVG?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
};

type NodeSection = {
  caption: string;
  nodes: Node[];
};

export type { Node, NodeSection };
