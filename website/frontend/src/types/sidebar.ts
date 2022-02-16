export type Node = {
  isCustom: boolean;
  address: string;
};

export type NodeSection = {
  caption: string;
  nodes: Node[];
};

[
  { address: 'custom address 1', isCustom: true },
  { address: 'custom address 2', isCustom: true },
  { address: 'custom address 3', isCustom: true },
  { address: 'custom address 4', isCustom: true },
];
