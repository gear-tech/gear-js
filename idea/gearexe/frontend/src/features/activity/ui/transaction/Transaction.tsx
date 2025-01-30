import { CopyButton } from "@/components";
import { ExpandableItem } from "../expandableItem/ExpandableItem";
import styles from "./Transaction.module.scss";

type Props = {};

export const Transaction = ({}: Props) => {
  const params = {
    payload:
      "mint (to 0xdAC17F958D2ee523a2206206994597C13D831ec7, amount: 100.)",
    value: 100000,
  };
  return (
    <ExpandableItem
      isNested
      // ! TODO:
      header={<div className={styles.transaction}>Balance transfer</div>}
    >
      <div className={styles.params}>
        {Object.entries(params).map(([key, value]) => (
          <div className={styles.param}>
            {key}: {value} <CopyButton value={String(value)} />
          </div>
        ))}
      </div>
    </ExpandableItem>
  );
};
