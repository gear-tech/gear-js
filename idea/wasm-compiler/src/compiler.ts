import { exec } from 'child_process';
import { readdirSync, readFileSync, rmSync } from 'fs';
import { isWasm, packZip } from './util';
import { DBService } from './db';
import { join } from 'path';
import { PATH_TO_BUILD_IMAGE_SCRIPT, PATH_TO_RUN_CONTAINER_SCRIPT } from './configuration';
import Docker from 'dockerode';
import { stdout } from 'process';

function findErr(error: string) {
  return error.slice(error.indexOf('error['), error.indexOf('Failed')).replace(
    // eslint-disable-next-line no-control-regex
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    '',
  );
}

export class CompilerService {
  dbService: DBService;
  docker: Docker;
  id: string;

  constructor(dbService: DBService) {
    this.dbService = dbService;
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
  }

  async _buildImage() {
    const stream = await this.docker.buildImage(
      { context: './wasm-build', src: ['Dockerfile', 'build.sh'] },
      { t: 'wasm-build' },
    );
    return new Promise((resolve, reject) => {
      this.docker.modem.followProgress(
        stream,
        (err, res) => (err ? reject(err) : resolve(res)),
        (obj) => {
          obj.stream && console.log(obj.stream);
          if (obj.aux?.ID) {
            this.id = obj.aux.ID.slice(7);
            console.log(`ID: ${this.id}`);
          }
        },
      );
    });
  }

  async buildImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log(PATH_TO_BUILD_IMAGE_SCRIPT);
      exec(PATH_TO_BUILD_IMAGE_SCRIPT, (error, stdout, stderr) => {
        console.log(stderr);
        console.log(stdout);
        if (error) {
          console.log(error);
          reject(error);
        }
        return resolve('ok');
      });
    });
  }

  async _runContainer(pathToFolder: string) {
    const stream = await this.docker.run(
      this.id,
      ['./build.sh'],
      stdout,
      {},
      { mount: `type=bind,source=${pathToFolder},target=/wasm-build/build` },
    );
    return new Promise((resolve, reject) => {
      this.docker.modem.followProgress(
        stream,
        (err, res) => (err ? reject(err) : resolve(res)),
        (obj) => {
          obj.stream ? console.log(obj.stream) : console.log(obj);
        },
      );
    });
  }
  runContainer(pathToFolder: string) {
    return new Promise((resolve, reject) => {
      exec(`PROJECT_PATH=${pathToFolder} ${PATH_TO_RUN_CONTAINER_SCRIPT}`, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve('ok');
        }
      });
    });
  }

  async processBuild(pathToFolder: string, id: string) {
    try {
      console.log(await this._runContainer(pathToFolder));
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
      this.dbService.update(id, null, 'Compilation failed');
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
