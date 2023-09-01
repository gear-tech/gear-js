import { HumanTypesRepr } from '@gear-js/api';
import { AnyJson } from '@polkadot/types/types';
import isPlainObject from 'lodash.isplainobject';

const downloadJson = (state: AnyJson) => {
  const json = JSON.stringify(state, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('style', 'display: none');
  link.setAttribute('href', url);
  link.setAttribute('download', 'state');

  document.body.appendChild(link);
  link.click();

  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

const isHumanTypesRepr = (types: number | HumanTypesRepr | null): types is HumanTypesRepr => isPlainObject(types);

export { downloadJson, isHumanTypesRepr };
