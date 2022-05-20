import { Button } from '@gear-js/ui';
import { Loader } from 'components';
import { useLoading } from 'hooks';
import styles from './RefreshButton.module.scss';

function RefreshButton() {
  const { isLoading, triggerRefresh } = useLoading();

  return (
    <div className={styles.wrapper}>
      <Button
        text="Refresh"
        color="secondary"
        onClick={triggerRefresh}
        className={styles.button}
        disabled={isLoading}
      />
      {isLoading && <Loader />}
    </div>
  );
}

export default RefreshButton;
