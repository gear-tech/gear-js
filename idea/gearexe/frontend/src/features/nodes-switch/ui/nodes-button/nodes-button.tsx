import clsx from "clsx";
import { MouseEvent } from "react";

import GearIcon from "@/assets/icons/gear.svg?react";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";

import styles from "./nodes-button.module.scss";

type Props = {
  name: string;
  isOpen: boolean;
  onClick: (event: MouseEvent) => void;
};

const NodesButton = ({ name, isOpen, onClick }: Props) => {
  return (
    <button type="button" className={styles.nodeInfoButton} onClick={onClick}>
      <GearIcon className={styles.icon} />

      <span className={styles.nodeInfo}>{name}</span>

      <ArrowDownIcon className={clsx(isOpen && styles.open)} />
    </button>
  );
};

export { NodesButton };
