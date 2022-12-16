type Node = {
  isCustom: boolean;
  address: string;
};

type NodeSection = {
  caption: string;
  nodes: Node[];
};

export type { Node, NodeSection };
