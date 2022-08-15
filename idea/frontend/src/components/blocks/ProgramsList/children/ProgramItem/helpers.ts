import { ProgramStatus } from 'types/program';
import { IndicatorStatus } from 'components/common/CircleIndicator';

export const getIndicatorStatus = (programStatus: ProgramStatus): IndicatorStatus => {
  switch (programStatus) {
    case ProgramStatus.Success:
      return IndicatorStatus.Success;
    case ProgramStatus.InProgress:
      return IndicatorStatus.Loading;
    default:
      return IndicatorStatus.Error;
  }
};
