import * as ethers from 'ethers';

/**
 * Interface for decoded transaction data
 */
export interface DecodedTransaction {
  methodName: string;
  signature: string;
  sighash: string;
  args: any[];
  namedArgs: Record<string, any>;
}

/**
 * Interface for method signature information
 */
export interface MethodSignature {
  name: string;
  signature: string;
  sighash: string;
  fragment: ethers.FunctionFragment;
}

/**
 * Extract all method signatures and sighashes from an ABI interface
 * @param abi - The ethers Interface instance
 * @returns Array of method signature information
 */
export function extractMethodSignatures(abi: ethers.Interface): MethodSignature[] {
  const signatures: MethodSignature[] = [];

  abi.forEachFunction((fragment) => {
    const signature = fragment.format('full');
    const sighash = abi.getFunction(fragment.name)!.selector;

    signatures.push({
      name: fragment.name,
      signature,
      sighash,
      fragment,
    });
  });

  return signatures;
}

/**
 * Get all sighashes from an ABI interface
 * @param abi - The ethers Interface instance
 * @returns Array of sighashes (method selectors)
 */
export function getSighashes(abi: ethers.Interface): string[] {
  return extractMethodSignatures(abi).map((sig) => sig.sighash);
}

/**
 * Decode transaction input data using the provided ABI
 * @param abi - The ethers Interface instance
 * @param inputData - The transaction input data (hex string)
 * @returns Decoded transaction data or null if decoding fails
 */
export function decodeTransactionData(abi: ethers.Interface, inputData: string): DecodedTransaction | null {
  if (!inputData || inputData === '0x' || inputData.length < 10) {
    return null;
  }

  try {
    const methodId = inputData.slice(0, 10);
    const fragment = abi.getFunction(methodId);

    if (!fragment) {
      return null;
    }

    const decodedArgs = abi.decodeFunctionData(fragment, inputData);
    const signature = fragment.format('full');

    // Create named arguments object
    const namedArgs: Record<string, any> = {};
    fragment.inputs.forEach((input, index) => {
      if (input.name) {
        namedArgs[input.name] = decodedArgs[index];
      }
    });

    return {
      methodName: fragment.name,
      signature,
      sighash: methodId,
      args: Array.from(decodedArgs),
      namedArgs,
    };
  } catch (_error) {
    // Decoding failed, return null
    return null;
  }
}

/**
 * Create a method signature manually (useful for custom signatures)
 * @param functionSignature - Function signature string (e.g., "transfer(address,uint256)")
 * @returns Sighash (method selector)
 */
export function createSighash(functionSignature: string): string {
  return ethers.id(functionSignature).slice(0, 10);
}

/**
 * Batch decode multiple transaction inputs using the same ABI
 * @param abi - The ethers Interface instance
 * @param transactions - Array of transaction input data
 * @returns Array of decoded results (null for failed decodings)
 */
export function batchDecodeTransactions(abi: ethers.Interface, transactions: string[]): (DecodedTransaction | null)[] {
  return transactions.map((inputData) => decodeTransactionData(abi, inputData));
}

/**
 * Check if a transaction input matches any of the provided sighashes
 * @param inputData - Transaction input data
 * @param sighashes - Array of sighashes to check against
 * @returns True if the transaction matches any sighash
 */
export function matchesSighash(inputData: string, sighashes: string[]): boolean {
  if (!inputData || inputData.length < 10) {
    return false;
  }

  const methodId = inputData.slice(0, 10);
  return sighashes.includes(methodId);
}

/**
 * Get human-readable method name from transaction input
 * @param abi - The ethers Interface instance
 * @param inputData - Transaction input data
 * @returns Method name or null if not found
 */
export function getMethodName(abi: ethers.Interface, inputData: string): string | null {
  const decoded = decodeTransactionData(abi, inputData);
  return decoded?.methodName || null;
}

/**
 * Format decoded arguments for logging or storage
 * @param decodedTx - Decoded transaction data
 * @returns Formatted string representation
 */
export function formatDecodedTransaction(decodedTx: DecodedTransaction): string {
  const args = decodedTx.args
    .map((arg) => {
      if (typeof arg === 'bigint') {
        return arg.toString();
      }
      if (Array.isArray(arg)) {
        return `[${arg.join(', ')}]`;
      }
      return String(arg);
    })
    .join(', ');

  return `${decodedTx.methodName}(${args})`;
}
