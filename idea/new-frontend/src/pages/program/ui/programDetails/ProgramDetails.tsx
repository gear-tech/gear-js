import { IProgram, ProgramTable } from 'entities/program';

import { Subheader } from '../../../../shared/ui/subheader';

type Props = {
  program: IProgram;
};

const ProgramDetails = ({ program }: Props) => (
  <article>
    <Subheader title="Program details" />
    <ProgramTable program={program} />
  </article>
);

export { ProgramDetails };
