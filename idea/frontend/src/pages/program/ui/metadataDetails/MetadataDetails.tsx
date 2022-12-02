import { Metadata } from '@gear-js/api';

import { MetadataTable } from 'entities/metadata';
import { Subheader } from 'shared/ui/subheader';
import { ReactComponent as MetadataDetailsSVG } from 'shared/assets/images/placeholders/metadataDetails.svg';

import { ContentLoader } from '../contentLoader';

type Props = {
  metadata?: Metadata;
  isLoading: boolean;
};

const MetadataDetails = ({ metadata, isLoading }: Props) => {
  const isEmpty = !(isLoading || metadata);
  const isLoaderShowing = isLoading || !metadata;

  return (
    <article>
      <Subheader title="Metadata" />
      {isLoaderShowing ? (
        <ContentLoader text="There are no metadata yet" isEmpty={isEmpty}>
          <MetadataDetailsSVG />
        </ContentLoader>
      ) : (
        <MetadataTable metadata={metadata} />
      )}
    </article>
  );
};

export { MetadataDetails };
