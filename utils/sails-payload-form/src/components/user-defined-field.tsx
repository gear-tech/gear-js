import type { FieldProps } from '../types';
import { getLabel } from '../utils';
import { isUserDefined, resolveNamedType } from '../utils/type-decl';

function UserDefinedField({ program, serviceName, def, name, label, render, renderField }: FieldProps) {
  if (!isUserDefined(def)) throw new Error('Expected user-defined type');

  const resolved = resolveNamedType(program, serviceName, def);

  if (!resolved) throw new Error(`Failed to resolve user-defined type: ${def.name}`);

  if (resolved.kind === 'alias') return renderField(resolved.target, label, name);

  return render.ui.fieldset({
    legend: getLabel(label, def, resolved),
    children: renderField(def, '', name, resolved),
  });
}

export { UserDefinedField };
