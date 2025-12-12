function shutdownVaraEth() {
  const varaEthPid = Object.getOwnPropertyDescriptor(globalThis, '__VARA_ETH_PID__');

  if (varaEthPid) {
    process.kill(-varaEthPid.value);
  } else {
    console.error(`Failed to kill varaEth process. PID not found`);
  }
}

export default async () => {
  shutdownVaraEth();
};
