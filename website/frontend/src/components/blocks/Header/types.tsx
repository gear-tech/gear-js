export type Node = {
  custom: boolean;
  address: string;
};

export type NodeSection = {
  caption: string;
  nodes: Nodes;
};

export type Nodes = Node[];

export type NodeSections = NodeSection[];
