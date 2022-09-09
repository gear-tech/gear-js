import { Metadata } from '@gear-js/api';

import { MetadataTable } from 'entities/metadata';

import { Subheader } from '../../../../shared/ui/subheader';

type Props = {
  metadata?: Metadata;
};

const MetadataDetails = ({ metadata }: Props) => (
  <article>
    <Subheader title="Metadata" />
    {metadata && <MetadataTable metadata={metadata} />}
  </article>
);

export { MetadataDetails };
