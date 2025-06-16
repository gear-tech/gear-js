import { ethers } from 'ethers';
import assert from 'node:assert';
import fs from 'node:fs';

const pathToJsonAbi = process.argv[2];

assert.notStrictEqual(pathToJsonAbi, undefined, "path to json abi wasn't provided");

const {
  abi,
  ast: { absolutePath },
} = JSON.parse(fs.readFileSync(pathToJsonAbi, 'utf-8'));

assert.notStrictEqual(abi, undefined, 'invalid abi');

const iface = new ethers.Interface(abi);

const name = absolutePath.split('/').at(-1).replace('.sol', '');

const upperName = name.toUpperCase();

/**
 * Maps Solidity types to TypeScript types
 */
function mapSolidityToTS(solidityType) {
  // Handle arrays
  if (solidityType.endsWith('[]')) {
    const baseType = solidityType.slice(0, -2);
    return `${mapSolidityToTS(baseType)}[]`;
  }

  // Handle fixed arrays like uint256[5]
  const arrayMatch = solidityType.match(/^(.+)\[(\d+)\]$/);
  if (arrayMatch) {
    const baseType = mapSolidityToTS(arrayMatch[1]);
    const size = parseInt(arrayMatch[2]);
    return `readonly [${Array(size).fill(baseType).join(', ')}]`;
  }

  // Handle tuples
  if (solidityType.startsWith('tuple')) {
    return 'any'; // For now, we'll use 'any' for complex tuples
  }

  // Basic types
  if (solidityType.startsWith('uint') || solidityType.startsWith('int')) {
    return 'bigint';
  }
  if (solidityType === 'address') {
    return 'string';
  }
  if (solidityType === 'bytes32' || solidityType.startsWith('bytes')) {
    return 'string';
  }
  if (solidityType === 'string') {
    return 'string';
  }
  if (solidityType === 'bool') {
    return 'boolean';
  }

  return 'unknown';
}

/**
 * Generates TypeScript interface from ABI
 */
function generateInterface(abi, contractName) {
  const allMethods = abi.filter((item) => item.type === 'function');

  if (allMethods.length === 0) {
    return '';
  }

  const methods = allMethods
    .map((func) => {
      const params = func.inputs?.map((input) => `${input.name}: ${mapSolidityToTS(input.type)}`).join(', ') || '';

      let returnType;
      if (!func.outputs || func.outputs.length === 0) {
        returnType = 'void';
      } else if (func.outputs.length === 1) {
        returnType = mapSolidityToTS(func.outputs[0].type);
      } else {
        // Multiple outputs - return as tuple
        returnType = `[${func.outputs.map((o) => mapSolidityToTS(o.type)).join(', ')}]`;
      }

      return `  /**
   * ${func.name} - ${func.stateMutability} function
   */
  ${func.name}(${params}): Promise<${returnType}>;`;
    })
    .join('\n\n');

  return `
/**
 * Interface for ${contractName} contract methods
 */
export interface I${contractName} {
${methods}
}`;
}

const interfaceCode = generateInterface(abi, name);

let result =
  `import { ethers } from 'ethers';\n\n` +
  `export const ${upperName}_ABI = ${JSON.stringify(iface.format(), null, 2)};\n\n` +
  `export const ${upperName}_INTERFACE = new ethers.Interface(${upperName}_ABI);\n` +
  interfaceCode;

fs.writeFileSync(`src/eth/abi/${name}.ts`, result);
