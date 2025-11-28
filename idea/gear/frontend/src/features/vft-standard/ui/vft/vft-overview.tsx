import { HexString } from '@gear-js/api';
import { useProgramQuery } from '@gear-js/react-hooks';

import { Box } from '@/shared/ui';

import { useVftProgram } from '../../hooks';

import { VftActions, VftReads } from './vft-actions';
import styles from './vft-overview.module.scss';

type Props = {
  id: HexString | undefined;
};

function VftOverview({ id }: Props) {
  const { data: program } = useVftProgram(id);

  const name = useProgramQuery({ program, serviceName: 'vft', functionName: 'name', args: [] });
  const symbol = useProgramQuery({ program, serviceName: 'vft', functionName: 'symbol', args: [] });
  const totalSupply = useProgramQuery({ program, serviceName: 'vft', functionName: 'totalSupply', args: [] });
  const decimals = useProgramQuery({ program, serviceName: 'vft', functionName: 'decimals', args: [] });

  return (
    <Box>
      <h2>VFT Overview</h2>

      <header>
        <h3>{name.data}</h3>
        <span>{symbol.data}</span>

        <VftActions />
        <VftReads />
      </header>

      <div>
        <div>
          <span>Total Supply:</span>
          <span>{totalSupply.data}</span>
        </div>

        <div>
          <span>Decimals:</span>
          <span>{decimals.data}</span>
        </div>
      </div>
    </Box>
  );
}

export { VftOverview };
