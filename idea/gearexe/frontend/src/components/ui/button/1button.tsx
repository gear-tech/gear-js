import { clsx } from "clsx";
import LoadingIcon from "@/assets/icons/loading.svg?react";
import styles from "./Button.module.scss";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "link" | "icon" | "ghost" | "secondary";
  size?: "default" | "sm" | "xs" | "icon";
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  isLoading,
  disabled,
  children,
  className,
  onClick,
}) => {
  const isDisabled = disabled || isLoading;
  const buttonClass = clsx(
    styles.button,
    styles[`btn--variant-${variant}`],
    styles[`size-${size}`],
    {
      [styles[`state-disabled`]]: isDisabled,
      [styles[`state-loading`]]: isLoading,
    },
    className
  );

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
    >
      {isLoading ? (
        <LoadingIcon className={styles["animate-spin"]} />
      ) : (
        children
      )}
    </button>
  );
};

export { Button };
