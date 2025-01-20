type Node = {
  address: string;
  isCustom: boolean;
  icon?: string;
};

type NodeSection = {
  caption: string;
  nodes: Node[];
};

export type { Node, NodeSection };
