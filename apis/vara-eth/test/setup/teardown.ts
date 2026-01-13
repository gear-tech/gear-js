function shutdownVaraEth() {
  const varaEthPid = Object.getOwnPropertyDescriptor(globalThis, '__VARA_ETH_PID__');
  const logFile = Object.getOwnPropertyDescriptor(globalThis, '__VARA_ETH_LOG_FILE__');

  if (varaEthPid && varaEthPid.value !== undefined && varaEthPid.value !== null) {
    try {
      // Kill the entire process group (negative PID)
      process.kill(-varaEthPid.value);
    } catch (err: any) {
      // If killing the process group fails, try killing just the process
      if (err.code === 'ESRCH' || err.code === 'EPERM') {
        try {
          process.kill(varaEthPid.value);
        } catch (fallbackErr: any) {
          console.error(`Failed to kill varaEth process (PID: ${varaEthPid.value}):`, fallbackErr.message);
        }
      } else {
        console.error(`Failed to kill varaEth process group (PID: ${varaEthPid.value}):`, err.message);
      }
    }
  } else {
    console.error('Failed to kill varaEth process. PID not found or invalid');
  }

  // Close the log file stream if it exists
  if (logFile && logFile.value) {
    try {
      logFile.value.end();
    } catch (err: any) {
      console.error('Failed to close log file:', err.message);
    }
  }
}

export default async () => {
  shutdownVaraEth();
};
