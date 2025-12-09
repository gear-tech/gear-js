import styles from './media-query.module.scss';

type BreakpointSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface SizeProps {
  above?: React.ReactNode;
  below?: React.ReactNode;
}

const createSizeComponent = (size: BreakpointSize) =>
  function SizeComponent({ above, below }: SizeProps) {
    const aboveClassName = styles[`above${size}` as keyof typeof styles];
    const belowClassName = styles[`below${size}` as keyof typeof styles];

    return (
      <>
        {above && <span className={aboveClassName}>{above}</span>}
        {below && <span className={belowClassName}>{below}</span>}
      </>
    );
  };

const MediaQuery = {
  sm: createSizeComponent('sm'),
  md: createSizeComponent('md'),
  lg: createSizeComponent('lg'),
  xl: createSizeComponent('xl'),
  xxl: createSizeComponent('xxl'),
};

export { MediaQuery, type BreakpointSize };
