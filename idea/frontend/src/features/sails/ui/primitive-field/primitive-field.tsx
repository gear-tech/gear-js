import { Input } from '@gear-js/ui';

import { PrimitiveDef } from '../../types';

type Props = {
  def: PrimitiveDef;
  name: string;
};

const getPrimitiveType = (def: PrimitiveDef) => {
  if (def.isNull) return 'Null';
  if (def.isBool) return 'Bool';
  if (def.isChar) return 'Char';
  if (def.isStr) return 'Str';
  if (def.isU8) return 'U8';
  if (def.isU16) return 'U16';
  if (def.isU32) return 'U32';
  if (def.isU64) return 'U64';
  if (def.isU128) return 'U128';
  if (def.isI8) return 'I8';
  if (def.isI16) return 'I16';
  if (def.isI32) return 'I32';
  if (def.isI64) return 'I64';
  if (def.isI128) return 'I128';
  if (def.isActorId) return 'ActorId';
  if (def.isCodeId) return 'CodeId';
  if (def.isMessageId) return 'MessageId';
  if (def.isH256) return 'H256';
  if (def.isU256) return 'U256';
};

function PrimitiveField({ def, name }: Props) {
  const type = getPrimitiveType(def);
  const label = name ? `${name} (${type})` : type;

  return <Input direction="y" label={label} />;
}

export { PrimitiveField };
