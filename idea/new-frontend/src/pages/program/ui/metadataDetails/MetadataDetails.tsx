import { Metadata } from '@gear-js/api';

import { MetadataTable } from 'entities/metadata';

import { Subheader } from '../subheader';

type Props = {
  metadata: Metadata;
};

const MetadataDetails = ({ metadata }: Props) => (
  <article>
    <Subheader title="Metadata" />
    <MetadataTable metadata={metadata} />
  </article>
);

export { MetadataDetails };
