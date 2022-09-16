import { Hex } from '@gear-js/api';

interface PayloadScheme {
  name: string;
  variantName?: string;
  variantExample?: string;
}

interface FuncScheme {
  name: string;
  description: string;
  input?: PayloadScheme;
  output?: PayloadScheme;
}

export interface Scheme {
  name: string;
  version: string;
  description: string;
  init?: FuncScheme[];
  handle?: FuncScheme[];
  reply?: FuncScheme[];
  registry: Hex;
}
