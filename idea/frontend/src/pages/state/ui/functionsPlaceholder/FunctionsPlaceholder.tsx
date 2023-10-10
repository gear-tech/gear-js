import FunctionPlaceholderSVG from '@/shared/assets/images/placeholders/stateFunctionPlaceholder.svg?react';
import { Placeholder } from '@/entities/placeholder';

import styles from './FunctionsPlaceholder.module.scss';

type Props = {
  isEmpty: boolean;
  file?: boolean;
};

const FunctionsPlaceholder = ({ isEmpty, file }: Props) => (
  <div className={styles.placeholder}>
    <Placeholder
      block={<FunctionPlaceholderSVG />}
      title={file ? 'No file selected' : 'There are no functions yet'}
      description={file ? '' : 'The list is empty while there are no functions'}
      isEmpty={isEmpty}
      blocksCount={file ? 3 : 9}
    />
  </div>
);

export { FunctionsPlaceholder };
