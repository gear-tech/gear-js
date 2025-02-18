import { Badge, Button, Input, ExpandableItem } from '@/components';
import styles from './service-list.module.scss';

const ServiceList = () => {
  const serviceName = 'Service 1';
  const functionName = 'Function 1';
  const functionsCount = 2 as number;
  const functionsTitle = functionsCount === 1 ? 'Function' : 'Functions';
  const isWrite = true;
  const isDisabled = true;

  return (
    <div>
      <ExpandableItem
        header={serviceName}
        headerSlot={
          <Badge color="secondary" className={styles.badge}>
            {functionsCount} {functionsTitle}
          </Badge>
        }>
        <ExpandableItem
          header={functionName}
          isNested
          headerSlot={
            <Button variant="default" size="xs" disabled={isDisabled} className={styles.action}>
              {isWrite ? 'Write' : 'Read'}
            </Button>
          }>
          <Input name="owner" placeholder="0x" />
          <Input name="spender" placeholder="0x" error={'Unknown error'} />
        </ExpandableItem>
      </ExpandableItem>
    </div>
  );
};

export { ServiceList };
