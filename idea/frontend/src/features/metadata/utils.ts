import { HumanTypesRepr, ProgramMetadata } from '@gear-js/api';
import isPlainObject from 'lodash.isplainobject';

import { isNullOrUndefined } from 'shared/helpers';

const isHumanTypesRepr = (types: number | HumanTypesRepr | null): types is HumanTypesRepr => isPlainObject(types);

const isState = (metadata: ProgramMetadata | undefined) =>
  !!metadata &&
  (typeof metadata.types.state === 'number' || // old version types support
    (isHumanTypesRepr(metadata.types.state) && !isNullOrUndefined(metadata.types.state.output)));

export { isHumanTypesRepr, isState };
