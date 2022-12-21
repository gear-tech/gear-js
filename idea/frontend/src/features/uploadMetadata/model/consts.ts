import { ProgramMetadata } from '@gear-js/api';

const META_FIELDS: (keyof ProgramMetadata['types'])[] = ['init', 'handle', 'reply', 'others', 'signal', 'state'];

export { META_FIELDS };
