import { useApi } from '@gear-js/react-hooks';
import { FunctionComponent, JSX } from 'react';

function withDeprecatedFallback<T>(component: FunctionComponent<T>, deprecatedComponent: FunctionComponent<T>) {
  // eslint-disable-next-line react/display-name -- TODO(#1800): resolve eslint comments
  return (props: T & JSX.IntrinsicAttributes) => {
    const { isV110Runtime } = useApi();
    const Component = isV110Runtime ? component : deprecatedComponent;

    return <Component {...props} />;
  };
}

export { withDeprecatedFallback };
