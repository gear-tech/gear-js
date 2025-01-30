import { Button } from "../button/Button";
import styles from "./Tabs.module.scss";

type Props = {
  tabs: string[];
  tabIndex: number;
  onTabIndexChange: (tabIndex: number) => void;
};

export const Tabs = ({ tabs, tabIndex, onTabIndexChange }: Props) => {
  return (
    <div className={styles.container}>
      {tabs.map((name, index) => {
        const isSelected = tabIndex === index;
        return (
          <Button
            key={name}
            variant={isSelected ? "secondary" : "outline"}
            className={styles.button}
            size="xs"
            onClick={() => onTabIndexChange(index)}
          >
            {name}
          </Button>
        );
      })}
    </div>
  );
};
