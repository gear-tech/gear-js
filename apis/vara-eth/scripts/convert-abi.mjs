import { ethers } from 'ethers';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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
 * Creates a hash for a function signature for comparison
 */
function createFunctionHash(func) {
  const signature = `${func.name}(${func.inputs?.map((i) => `${i.name}:${i.type}`).join(',') || ''})=>${func.outputs?.map((o) => o.type).join(',') || 'void'}`;
  return crypto.createHash('md5').update(signature).digest('hex');
}

/**
 * Extracts JSDoc comment from method content
 */
function extractMethodComment(methodContent) {
  const commentMatch = methodContent.match(/(\/\*\*[\s\S]*?\*\/)/);
  return commentMatch ? commentMatch[1] : null;
}

/**
 * Extracts method signature without comment
 */
function extractMethodSignature(methodContent) {
  const signatureMatch = methodContent.match(/\/\*\*[\s\S]*?\*\/\s*(.+)/);
  return signatureMatch ? signatureMatch[1] : methodContent.trim();
}

/**
 * Normalizes comment indentation to match interface method level
 */
function normalizeCommentIndentation(comment) {
  if (!comment) return null;

  // Split comment into lines and normalize indentation
  const lines = comment.split('\n');
  const normalizedLines = lines.map((line, index) => {
    if (index === 0) {
      // First line should start with proper indentation
      return line.trim().startsWith('/**') ? '  /**' : '  ' + line.trim();
    } else if (line.trim() === '*/') {
      // Last line should have proper indentation
      return '   */';
    } else if (line.trim().startsWith('*')) {
      // Middle lines should have proper indentation
      return '   ' + line.trim();
    } else {
      // Other lines (shouldn't happen in well-formed JSDoc)
      return '   ' + line.trim();
    }
  });

  return normalizedLines.join('\n');
}

/**
 * Parses existing TypeScript interface to extract method information
 */
function parseExistingInterface(content) {
  const methods = new Map();
  const interfaceMatch = content.match(/export interface I\w+\s*{([^}]+)}/s);

  if (!interfaceMatch) {
    return methods;
  }

  const interfaceBody = interfaceMatch[1];

  // Extract method signatures using regex
  const methodMatches = interfaceBody.matchAll(/(\/\*\*[\s\S]*?\*\/\s*)?(\w+)\([^)]*\):\s*Promise<[^>]+>;/g);

  for (const match of methodMatches) {
    const fullMatch = match[0];
    const methodName = match[2];
    const comment = extractMethodComment(fullMatch);
    const signature = extractMethodSignature(fullMatch);

    methods.set(methodName, {
      name: methodName,
      content: fullMatch,
      comment: normalizeCommentIndentation(comment),
      signature: signature,
      hash: crypto.createHash('md5').update(signature).digest('hex'), // Hash only signature, not comment
    });
  }

  return methods;
}

/**
 * Generates TypeScript method signature
 */
function generateMethodSignature(func, existingComment = null) {
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

  // Use existing comment if available, otherwise generate default
  const comment =
    existingComment ||
    `  /**
   * ${func.name} - ${func.stateMutability} function
   */`;

  const methodSignature = `  ${func.name}(${params}): Promise<${returnType}>;`;

  return {
    name: func.name,
    signature: `${comment}
${methodSignature}`,
    hash: createFunctionHash(func),
  };
}

/**
 * Compares ABI functions with existing interface methods
 */
function analyzeMethodChanges(abiFunctions, existingMethods) {
  const newMethods = new Map();
  const updatedMethods = new Map();
  const unchangedMethods = new Map();
  const removedMethods = new Map(existingMethods);

  // Analyze each ABI function
  for (const func of abiFunctions) {
    const existing = existingMethods.get(func.name);

    if (!existing) {
      // New method - generate with default comment
      const methodSig = generateMethodSignature(func);
      newMethods.set(func.name, methodSig);
    } else {
      // Remove from removedMethods since it exists in new ABI
      removedMethods.delete(func.name);

      // Generate new signature with existing comment preserved
      const methodSig = generateMethodSignature(func, existing.comment);

      if (existing.hash !== methodSig.hash) {
        // Method signature changed - use existing comment if available
        updatedMethods.set(func.name, methodSig);
      } else {
        // Method unchanged - preserve original content including comment
        unchangedMethods.set(func.name, {
          ...existing,
          signature: existing.content.replace(/^\s+/gm, '  '), // Normalize indentation
        });
      }
    }
  }

  return {
    new: newMethods,
    updated: updatedMethods,
    unchanged: unchangedMethods,
    removed: removedMethods,
  };
}

/**
 * Generates complete interface with all methods
 */
function generateCompleteInterface(methodsAnalysis, contractName) {
  const allMethods = [
    ...methodsAnalysis.unchanged.values(),
    ...methodsAnalysis.updated.values(),
    ...methodsAnalysis.new.values(),
  ];

  if (allMethods.length === 0) {
    return '';
  }

  const methodsContent = allMethods.map((method) => method.signature || method.content).join('\n');

  return `/**
 * Interface for ${contractName} contract methods
 */
export interface I${contractName} {
${methodsContent}
}`;
}

/**
 * Extracts content between markers from existing file
 */
function extractBetweenMarkers(content, startMarker, endMarker) {
  const startIndex = content.indexOf(startMarker);
  const endIndex = content.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    return null;
  }

  return {
    before: content.substring(0, startIndex),
    content: content.substring(startIndex + startMarker.length, endIndex),
    after: content.substring(endIndex + endMarker.length),
  };
}

/**
 * Updates content between markers or adds new section
 */
function updateBetweenMarkers(existingContent, startMarker, endMarker, newContent) {
  const extracted = extractBetweenMarkers(existingContent, startMarker, endMarker);

  if (extracted) {
    return extracted.before + startMarker + newContent + endMarker + extracted.after;
  } else {
    // Markers don't exist, append to end
    return existingContent + '\n' + startMarker + newContent + endMarker + '\n';
  }
}

/**
 * Preserves user-added imports and comments at the top of the file
 */
function preserveFileHeader(existingContent) {
  const lines = existingContent.split('\n');
  const headerLines = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Keep imports, comments, and empty lines at the top
    if (
      trimmed.startsWith('import ') ||
      trimmed.startsWith('export ') ||
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed === '' ||
      line.includes('GENERATED_') // Stop at first marker
    ) {
      if (line.includes('GENERATED_')) {
        break;
      }
      headerLines.push(line);
    } else {
      break;
    }
  }

  return headerLines.join('\n') + (headerLines.length > 0 ? '\n\n' : '');
}

/**
 * Logs detailed change summary
 */
function logChangeSummary(methodsAnalysis, contractName) {
  console.log(`\n=== ${contractName} Interface Changes ===`);

  if (methodsAnalysis.new.size > 0) {
    console.log(`✅ Added ${methodsAnalysis.new.size} new method(s):`);
    for (const method of methodsAnalysis.new.values()) {
      console.log(`   + ${method.name}()`);
    }
  }

  if (methodsAnalysis.updated.size > 0) {
    console.log(`🔄 Updated ${methodsAnalysis.updated.size} method(s):`);
    for (const method of methodsAnalysis.updated.values()) {
      console.log(`   ~ ${method.name}()`);
    }
  }

  if (methodsAnalysis.removed.size > 0) {
    console.log(`❌ Removed ${methodsAnalysis.removed.size} method(s):`);
    for (const method of methodsAnalysis.removed.values()) {
      console.log(`   - ${method.name}()`);
    }
  }

  if (methodsAnalysis.unchanged.size > 0) {
    console.log(`⚪ Unchanged: ${methodsAnalysis.unchanged.size} method(s)`);
  }

  const totalChanges = methodsAnalysis.new.size + methodsAnalysis.updated.size + methodsAnalysis.removed.size;
  if (totalChanges === 0) {
    console.log(`✨ No changes detected - file is up to date`);
  }

  console.log(`=====================================\n`);
}

const outputPath = `src/eth/abi/${name}.ts`;

// Generate new ABI content
const newAbiContent = `\nexport const ${upperName}_ABI = ${JSON.stringify(iface.format(), null, 2)};\n\nexport const ${upperName}_INTERFACE = new ethers.Interface(${upperName}_ABI);\n`;

// Markers for generated sections
const ABI_START_MARKER = '// GENERATED_ABI_START';
const ABI_END_MARKER = '// GENERATED_ABI_END';
const INTERFACE_START_MARKER = '// GENERATED_INTERFACE_START';
const INTERFACE_END_MARKER = '// GENERATED_INTERFACE_END';

let finalContent;
let methodsAnalysis;

if (fs.existsSync(outputPath)) {
  // File exists, perform intelligent update
  const existingContent = fs.readFileSync(outputPath, 'utf-8');

  // Parse existing interface methods
  const existingMethods = parseExistingInterface(existingContent);

  // Get ABI functions
  const abiFunctions = abi.filter((item) => item.type === 'function');

  // Analyze changes
  methodsAnalysis = analyzeMethodChanges(abiFunctions, existingMethods);

  // Generate updated interface
  const newInterfaceContent = '\n' + generateCompleteInterface(methodsAnalysis, name) + '\n';

  // Preserve header (imports, comments)
  const header = preserveFileHeader(existingContent);

  let updatedContent = existingContent;

  // Update ABI section
  updatedContent = updateBetweenMarkers(updatedContent, ABI_START_MARKER, ABI_END_MARKER, newAbiContent);

  // Update Interface section
  updatedContent = updateBetweenMarkers(
    updatedContent,
    INTERFACE_START_MARKER,
    INTERFACE_END_MARKER,
    newInterfaceContent,
  );

  // If no markers were found, create a new file with proper structure
  if (!existingContent.includes(ABI_START_MARKER) && !existingContent.includes(INTERFACE_START_MARKER)) {
    finalContent =
      header +
      ABI_START_MARKER +
      newAbiContent +
      ABI_END_MARKER +
      '\n' +
      INTERFACE_START_MARKER +
      newInterfaceContent +
      INTERFACE_END_MARKER +
      '\n';
  } else {
    finalContent = updatedContent;
  }

  console.log(`Updated existing file: ${outputPath}`);
} else {
  // File doesn't exist, create new one
  const abiFunctions = abi.filter((item) => item.type === 'function');
  const newMethods = new Map();

  for (const func of abiFunctions) {
    const methodSig = generateMethodSignature(func);
    newMethods.set(func.name, methodSig);
  }

  methodsAnalysis = {
    new: newMethods,
    updated: new Map(),
    unchanged: new Map(),
    removed: new Map(),
  };

  const newInterfaceContent = '\n' + generateCompleteInterface(methodsAnalysis, name) + '\n';
  const defaultHeader = `import { ethers } from 'ethers';\n\n`;

  finalContent =
    defaultHeader +
    ABI_START_MARKER +
    newAbiContent +
    ABI_END_MARKER +
    '\n' +
    INTERFACE_START_MARKER +
    newInterfaceContent +
    INTERFACE_END_MARKER +
    '\n';

  console.log(`Created new file: ${outputPath}`);
}

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write the file
fs.writeFileSync(outputPath, finalContent);

// Log detailed change summary
logChangeSummary(methodsAnalysis, name);

console.log(`ABI conversion completed for ${name}`);
console.log(`Generated ${upperName}_ABI, ${upperName}_INTERFACE, and I${name} interface`);
