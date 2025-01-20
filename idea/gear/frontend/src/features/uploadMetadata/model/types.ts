import { ProgramMetadata } from '@gear-js/api';

type MetadataTypes = ProgramMetadata['types'];
type MedatadaTypesValue = MetadataTypes[keyof MetadataTypes];

export type { MetadataTypes, MedatadaTypesValue };
