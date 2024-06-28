import { PreformattedBlock } from '@/shared/ui';

type Props = {
  value: string;
};

function IDL({ value }: Props) {
  return <PreformattedBlock text={value} />;
}

export { IDL };
