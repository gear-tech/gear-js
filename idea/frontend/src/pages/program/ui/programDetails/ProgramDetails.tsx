import { IProgram, ProgramTable } from 'entities/program';
import { Subheader } from 'shared/ui/subheader';
import { ReactComponent as ProgramDetailsSVG } from 'shared/assets/images/placeholders/programDetails.svg';

import { ContentLoader } from '../contentLoader';

type Props = {
  program?: IProgram;
  isLoading: boolean;
};

const ProgramDetails = ({ program, isLoading }: Props) => {
  const isEmpty = !(isLoading || program);
  const isLoaderShowing = isLoading || !program;

  return (
    <article>
      <Subheader title="Program details" />
      {isLoaderShowing ? (
        <ContentLoader text="There are no program" isEmpty={isEmpty}>
          <ProgramDetailsSVG />
        </ContentLoader>
      ) : (
        <ProgramTable program={program} />
      )}
    </article>
  );
};

export { ProgramDetails };
