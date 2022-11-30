interface Field {
  name: string | null;
  type: number;
  typeName: string | null;
}

interface Variant {
  variant: {
    variants: {
      name: string;
      fields: Field[];
      index: string;
      docs: string[];
    }[];
  };
}

interface Composite {
  composite: {
    fields: Field[];
  };
}

interface Primitive {
  primitive: string;
}

interface Sequence {
  sequence: { type: number };
}

interface Tuple {
  tuple: number[];
}

interface Array {
  tuple: { len: number; type: number };
}

interface PortableType<Def extends TypeDefinition = TypeDefinition> {
  id: number;
  type: { path?: string[]; params?: { name: string; type: number }[]; def: Def };
}

interface PortableRegistry {
  types: PortableType[];
}

type TypeDefinition = Primitive | Variant | Composite | Sequence | Tuple | Array;

function isPrimitive(type: PortableType): PortableType<Primitive> | null {
  if ('primitive' in type.type.def) {
    return type as PortableType<Primitive>;
  }
  return null;
}

function isComposite(type: PortableType) {
  if ('composite' in type.type.def) {
    return true;
  }
  return false;
}

export function parsePortableReg(pr: PortableRegistry) {
  const pathIdMap = new Map<string[], number>();
  const types = new Map<number, PortableType>();

  for (const type of pr.types) {
    if (type.type.path) {
      pathIdMap.set(type.type.path, type.id);
    }
    types.set(type.id, type);
  }
}

export function getTypeName(id: number, pr: PortableRegistry) {}
