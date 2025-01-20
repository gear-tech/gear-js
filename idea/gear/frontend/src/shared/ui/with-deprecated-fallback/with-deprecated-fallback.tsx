import { useApi } from '@gear-js/react-hooks';
import { FunctionComponent } from 'react';

function withDeprecatedFallback<T>(component: FunctionComponent<T>, deprecatedComponent: FunctionComponent<T>) {
  return (props: T & JSX.IntrinsicAttributes) => {
    const { isV110Runtime } = useApi();
    const Component = isV110Runtime ? component : deprecatedComponent;

    return <Component {...props} />;
  };
}

export { withDeprecatedFallback };
