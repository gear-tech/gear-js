import { clsx } from "clsx";
import { PropsWithChildren } from "react";
import styles from "./Layout.module.scss";

type Props = PropsWithChildren & {
  className?: string;
};

export const Layout = ({ children, className }: Props) => {
  return <div className={clsx(styles.container, className)}>{children}</div>;
};
