import { ProgramMetadata } from '@gear-js/api';

import { MetadataTable } from 'entities/metadata';
import { ReactComponent as MetadataDetailsSVG } from 'shared/assets/images/placeholders/metadataDetails.svg';

import { ContentLoader } from '../contentLoader';

type Props = {
  metadata: ProgramMetadata | undefined;
  isLoading: boolean;
};

const MetadataDetails = ({ metadata, isLoading }: Props) => {
  const isEmpty = !(isLoading || metadata);
  const isLoaderShowing = isLoading || !metadata;

  return isLoaderShowing ? (
    <ContentLoader text="There is no metadata yet" isEmpty={isEmpty}>
      <MetadataDetailsSVG />
    </ContentLoader>
  ) : (
    <MetadataTable metadata={metadata} />
  );
};

export { MetadataDetails };
