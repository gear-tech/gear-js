export type Node = {
  isCustom: boolean;
  address: string;
};

export type NodeSection = {
  caption: string;
  nodes: Node[];
};

export type GetMetaResponse = {
  program: string;
  meta: string;
  metaFile: string;
};

export type GetDefaultNodesResponse = NodeSection[];
