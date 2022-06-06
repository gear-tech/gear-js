import { exec } from 'child_process';
import { readdirSync, readFileSync, rmSync } from 'fs';
import { isWasm, packZip } from './util';
import { DBService } from './db';
import { join } from 'path';
import {
  PATH_TO_BUILD_IMAGE_SCRIPT,
  PATH_TO_RUN_CONTAINER_SCRIPT,
} from './configuration';

function findErr(error: string) {
  return error
    .slice(error.indexOf('error['), error.indexOf('Failed'))
    .replace(
      /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
      '',
    );
}

export class CompilerService {
  dbService: DBService;

  constructor(dbService: DBService) {
    this.dbService = dbService;
  }

  async buildImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(PATH_TO_BUILD_IMAGE_SCRIPT, (error) => {
        if (error) {
          console.log(error);
          reject(error);
        }
        return resolve('ok');
      });
    });
  }

  runContainer(pathToFolder: string) {
    return new Promise((resolve, reject) => {
      exec(
        `PROJECT_PATH=${pathToFolder} ${PATH_TO_RUN_CONTAINER_SCRIPT}`,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve('ok');
          }
        },
      );
    });
  }

  async processBuild(pathToFolder: string, id: string) {
    try {
      await this.runContainer(pathToFolder);
    } catch (error) {
      return this.dbService.update(id, null, findErr(error.message));
    }

    const resultFiles = readdirSync(pathToFolder)
      .filter(isWasm)
      .map((fileName) => ({
        content: readFileSync(join(pathToFolder, fileName)),
        fileName,
      }));

    if (resultFiles.length === 0) {
      this.dbService.update(id, null, `Compilation failed`);
    } else {
      const file = packZip(resultFiles);
      this.dbService.update(id, file);
    }
    try {
      rmSync(pathToFolder, { recursive: true });
    } catch (err) {
      console.log(err);
    }
  }
}
