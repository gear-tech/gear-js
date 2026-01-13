import { Worker } from 'node:worker_threads';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createLogger } from '@gear-js/logger';

const logger = createLogger('main');
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const RESTART_DELAY = 5000;
const MAX_RESTART_ATTEMPTS = 5;
const RESTART_WINDOW = 60000;

interface WorkerManager {
  worker: Worker | null;
  name: string;
  scriptPath: string;
  restartCount: number;
  lastRestartTime: number;
  isShuttingDown: boolean;
}

class WorkerSupervisor {
  private workers: Map<string, WorkerManager> = new Map();
  private isShuttingDown = false;

  registerWorker(name: string, scriptPath: string) {
    this.workers.set(name, {
      worker: null,
      name,
      scriptPath,
      restartCount: 0,
      lastRestartTime: 0,
      isShuttingDown: false,
    });
  }

  async startWorker(name: string): Promise<void> {
    const manager = this.workers.get(name);
    if (!manager) {
      throw new Error(`Worker ${name} not registered`);
    }

    if (manager.isShuttingDown || this.isShuttingDown) {
      logger.info(`Skipping start of ${name} - shutdown in progress`);
      return;
    }

    return new Promise((resolve, reject) => {
      logger.info(`Starting ${name} worker...`);
      const worker = new Worker(manager.scriptPath);
      manager.worker = worker;

      const startTime = Date.now();

      worker.on('message', (message) => {
        if (message.type === 'ready') {
          logger.info(`${name} worker is ready`);

          const runningTime = Date.now() - startTime;
          if (runningTime > RESTART_WINDOW) {
            manager.restartCount = 0;
          }

          resolve();
        } else if (message.type === 'error') {
          logger.error({ error: message.error }, `${name} worker initialization error`);
        }
      });

      worker.on('error', (error) => {
        logger.error(
          {
            error: error.message,
            stack: error.stack,
            worker: name,
          },
          `${name} worker encountered an error`,
        );
      });

      worker.on('exit', (code) => {
        const runningTime = Date.now() - startTime;

        logger.warn(
          {
            worker: name,
            exitCode: code,
            runningTime: `${(runningTime / 1000).toFixed(2)}s`,
            restartCount: manager.restartCount,
          },
          `${name} worker exited`,
        );

        manager.worker = null;

        if (manager.isShuttingDown || this.isShuttingDown || code === 0) {
          logger.info(`${name} worker stopped cleanly`);
          return;
        }

        if (runningTime > RESTART_WINDOW) {
          manager.restartCount = 0;
        }

        if (manager.restartCount >= MAX_RESTART_ATTEMPTS) {
          logger.error(
            {
              worker: name,
              attempts: manager.restartCount,
              timeWindow: `${RESTART_WINDOW / 1000}s`,
            },
            `${name} worker failed ${MAX_RESTART_ATTEMPTS} times. Giving up.`,
          );
          return;
        }

        manager.restartCount++;
        manager.lastRestartTime = Date.now();

        logger.info(
          {
            worker: name,
            attempt: manager.restartCount,
            delay: `${RESTART_DELAY / 1000}s`,
          },
          `Scheduling ${name} worker restart`,
        );

        setTimeout(() => {
          this.startWorker(name).catch((error) => {
            logger.error(
              {
                error: error.message,
                stack: error.stack,
                worker: name,
              },
              `Failed to restart ${name} worker`,
            );
          });
        }, RESTART_DELAY);
      });

      const initTimeout = setTimeout(() => {
        if (manager.worker === worker) {
          logger.error(`${name} worker failed to initialize within timeout`);
          worker.terminate();
          reject(new Error(`${name} worker initialization timeout`));
        }
      }, 30000);

      worker.once('message', (message) => {
        if (message.type === 'ready') {
          clearTimeout(initTimeout);
        }
      });
    });
  }

  async startAll(): Promise<void> {
    const workerNames = Array.from(this.workers.keys());

    logger.info(`Starting ${workerNames.length} workers: ${workerNames.join(', ')}`);

    const results = await Promise.allSettled(workerNames.map((name) => this.startWorker(name)));

    const failures: string[] = [];
    results.forEach((result, index) => {
      const name = workerNames[index];
      if (result.status === 'rejected') {
        logger.error(
          {
            worker: name,
            error: result.reason?.message || String(result.reason),
          },
          `Failed to start ${name} worker initially`,
        );
        failures.push(name);
      } else {
        logger.info(`${name} worker started successfully`);
      }
    });

    if (failures.length > 0) {
      logger.error(
        {
          failedWorkers: failures,
        },
        `Failed to start ${failures.length} worker(s) on initial launch. Exiting.`,
      );
      throw new Error(`Failed to start workers: ${failures.join(', ')}`);
    }

    logger.info('Worker supervisor initialized - all workers started successfully');
  }

  async shutdown(): Promise<void> {
    this.isShuttingDown = true;
    logger.info('Shutting down all workers...');

    const terminatePromises = Array.from(this.workers.values()).map(async (manager) => {
      manager.isShuttingDown = true;
      if (manager.worker) {
        logger.info(`Terminating ${manager.name} worker...`);
        await manager.worker.terminate();
        logger.info(`${manager.name} worker terminated`);
      }
    });

    await Promise.allSettled(terminatePromises);
    logger.info('All workers shut down');
  }

  getStatus(): { name: string; running: boolean; restartCount: number }[] {
    return Array.from(this.workers.values()).map((manager) => ({
      name: manager.name,
      running: manager.worker !== null,
      restartCount: manager.restartCount,
    }));
  }
}

async function run() {
  const supervisor = new WorkerSupervisor();

  supervisor.registerWorker('Processor', join(__dirname, 'workers', 'processor.worker.js'));
  supervisor.registerWorker('Server', join(__dirname, 'workers', 'server.worker.js'));

  await supervisor.startAll();

  const shutdown = async () => {
    logger.info('Received shutdown signal');
    await supervisor.shutdown();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  setInterval(() => {
    const status = supervisor.getStatus();
    logger.debug(
      {
        workers: status,
      },
      'Worker status check',
    );
  }, 60000);
}

run().catch((error) => {
  logger.error(
    {
      error: error.message,
      stack: error.stack,
    },
    'Fatal error in main process',
  );
  process.exit(1);
});
