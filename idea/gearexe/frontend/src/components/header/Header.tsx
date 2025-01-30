import { useAccount } from "wagmi";
import { WalletButton } from "../wallet/WalletButton";
import { HeaderBalance } from "@/components";
import logo from "@/assets/logo.png";
import { NodesSwitch } from "@/features/nodesSwitch";
import styles from "./Header.module.scss";

export const Header = () => {
  const ethAccount = useAccount();
  const isConnected = Boolean(ethAccount.chainId);

  return (
    <header className={styles.container}>
      <div className={styles.leftGroup}>
        <img src={logo} alt="Gear logo" />
        <NodesSwitch />
      </div>

      <div className={styles.rightGroup}>
        {isConnected && <HeaderBalance />}
        <WalletButton />
      </div>
    </header>
  );
};
