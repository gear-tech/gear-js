import { execSync, spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync, createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// Custom Error Class
// ============================================================================

export class ScriptError extends Error {
  constructor(message, code = 1) {
    super(message);
    this.name = 'ScriptError';
    this.code = code;
  }
}

// ============================================================================
// Logging Utilities
// ============================================================================

export const logger = {
  info: (msg) => console.log(`[*] ${msg}`),
  error: (msg) => console.error(`[!] ${msg}`),
  success: (msg) => console.log(`[✓] ${msg}`),
  debug: (msg) => {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${msg}`);
    }
  },
};

// ============================================================================
// Command Runner Utility
// ============================================================================

export class CommandRunner {
  static async exec(cmd, options = {}) {
    const { cwd = process.cwd(), stdio = 'inherit', timeout = 600_000, shell = false, env = {} } = options;

    logger.debug(`Running: ${cmd} in ${cwd}`);

    return new Promise((resolve, reject) => {
      try {
        const result = execSync(cmd, {
          cwd,
          stdio,
          shell: true,
          timeout,
          env: {
            ...process.env,
            ...env,
          },
        });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  static spawn(cmd, args, options = {}) {
    const { cwd = process.cwd(), logFile = null, timeout = null, env = {} } = options;

    logger.debug(`Spawning: ${cmd} ${args.join(' ')} in ${cwd}`);

    const child = spawn(cmd, args, {
      cwd,
      stdio: logFile ? ['ignore', 'pipe', 'pipe'] : 'inherit',
      env: { ...process.env, ...env },
    });

    if (logFile) {
      const logStream = createWriteStream(logFile, { flags: 'a' });
      child.stdout.pipe(logStream);
      child.stderr.pipe(logStream);
    }

    if (timeout) {
      setTimeout(() => {
        if (!child.killed) {
          child.kill('SIGTERM');
        }
      }, timeout);
    }

    return child;
  }

  static async command(cmd, args, options = {}) {
    const { cwd = process.cwd(), timeout = 30_000, env = {} } = options;

    return new Promise((resolve, reject) => {
      let stdout = '';
      let stderr = '';

      const child = spawn(cmd, args, { cwd, env: { ...process.env, ...env } });

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      const timeoutHandle = timeout
        ? setTimeout(() => {
            child.kill();
            reject(new ScriptError(`Command timeout after ${timeout}ms: ${cmd}`));
          }, timeout)
        : null;

      child.on('close', (code) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new ScriptError(`Command failed: ${cmd}\n${stderr}`));
        }
      });

      child.on('error', (err) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        reject(err);
      });
    });
  }
}

// ============================================================================
// Process Management Utilities
// ============================================================================

export function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export async function killProcess(pid, name = 'Process') {
  if (!isProcessRunning(pid)) {
    return;
  }

  logger.info(`Stopping ${name} (PID: ${pid})...`);
  try {
    process.kill(pid, 'SIGTERM');
    // Wait for graceful shutdown
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (isProcessRunning(pid)) {
      process.kill(pid, 'SIGKILL');
    }
  } catch {
    // Already dead
  }
  logger.info(`${name} stopped`);
}

// ============================================================================
// File System Utilities
// ============================================================================

export async function ensureDir(dir) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    logger.debug(`Directory creation warning: ${error.message}`);
  }
}

export async function cleanDir(dir) {
  try {
    await rm(dir, { recursive: true, force: true });
    await mkdir(dir, { recursive: true });
  } catch (error) {
    logger.debug(`Directory cleanup warning: ${error.message}`);
  }
}

export async function readFileContent(filePath) {
  try {
    return await readFile(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

export async function fileExists(filePath) {
  return existsSync(filePath);
}

// ============================================================================
// Version Management
// ============================================================================

export function parseVersion(versionString) {
  const match = versionString.match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    toString: () => `${match[1]}.${match[2]}.${match[3]}`,
  };
}

export function compareVersions(versionA, versionB) {
  if (versionA.major !== versionB.major) {
    return versionA.major - versionB.major;
  }
  if (versionA.minor !== versionB.minor) {
    return versionA.minor - versionB.minor;
  }
  return versionA.patch - versionB.patch;
}
