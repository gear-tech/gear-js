import clsx from 'clsx';
import SimpleBar from 'simplebar-react';

import { getPreformattedText } from '@/shared/helpers';

import styles from './PreformattedBlock.module.scss';

type Props = {
  text: unknown; // turn back to AnyJson, if component will not be used in SailsPreview
  className?: string;
};

const PreformattedBlock = ({ text, className }: Props) => (
  <SimpleBar className={clsx(styles.simpleBar, className)}>
    {/* string check cuz of sails idl */}
    <pre>{typeof text === 'string' ? text : getPreformattedText(text)}</pre>
  </SimpleBar>
);

export { PreformattedBlock };
