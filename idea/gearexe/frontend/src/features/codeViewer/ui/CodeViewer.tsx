import { CopyButton, SyntaxHighlighter, Tabs } from "@/components";
import styles from "./CodeViewer.module.scss";
import { useState } from "react";

const tabs = ["RUST", "IDL"];

export const CodeViewer = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const currentCode = `pragma solidity 0.6.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20Pausable.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Toke is ERC20Pausable, Ownable  {
    uint256 private constant SUPPLY = 100_000_000e18;
    constructor() public ERC20("Tokemak", "TOKE")  {  
        _mint(msg.sender, SUPPLY); // 100M
    }

    function pause() external onlyOwner {    
        _pause();
    }
}
`;

  return (
    <div className={styles.container}>
      <div className={styles.editor}>
        <SyntaxHighlighter code={currentCode} language="javascript" />
        <div className={styles.tabs}>
          <Tabs
            tabs={tabs}
            tabIndex={tabIndex}
            onTabIndexChange={(index) => {
              setTabIndex(index);
            }}
          />

          <CopyButton value={currentCode} />
        </div>
      </div>
    </div>
  );
};
