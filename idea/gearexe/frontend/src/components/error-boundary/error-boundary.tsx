import { Component, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@/components';
import { routes } from '@/shared/config';
import { useChangeEffect } from '@/shared/hooks';

import styles from './error-boundary.module.scss';

type Props = {
  children: ReactNode;
};

type FallbackProps = {
  message: string;
  reset: () => void;
};

type State = {
  error: Error | null;
};

function Fallback({ message, reset }: FallbackProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useChangeEffect(() => {
    reset();
  }, [pathname]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Oops! Something went wrong:</h2>
      <p className={styles.error}>{message}</p>

      <Button size="sm" onClick={() => navigate(routes.home)}>
        Go Back
      </Button>
    </div>
  );
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;

    console.log(this.props);

    return <Fallback message={this.state.error.message} reset={this.reset} />;
  }
}

export { ErrorBoundary };
