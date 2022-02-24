export type Node = {
  isCustom: boolean;
  address: string;
};

export type NodeSection = {
  caption: string;
  nodes: Nodes;
};

export type Nodes = Node[];

export type NodeSections = NodeSection[];
