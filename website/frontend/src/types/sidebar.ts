export type Node = {
  custom: boolean;
  address: string;
};

export type NodeSection = {
  caption: string;
  nodes: Node[];
};
