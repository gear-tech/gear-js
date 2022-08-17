import { spawn } from 'child_process';
import { readdirSync, readFileSync, rmSync } from 'fs';
import { isWasm, packZip } from './util';
import { DBService } from './db';
import { join } from 'path';
import { PATH_TO_RUN_CONTAINER_SCRIPT } from './configuration';
import Docker from 'dockerode';

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

  runContainer(pathToFolder: string) {
    return new Promise((resolve, reject) => {
      const docker = spawn(PATH_TO_RUN_CONTAINER_SCRIPT, {
        env: { PROJECT_PATH: pathToFolder },
      });

      docker.stderr.on('data', (data) => {
        console.error(data);
      });

      docker.stdout.on('data', (data) => {
        console.log(data);
      });

      docker.on('close', (code) => {
        console.log(`Exit with code: ${code}`);
        if (code === 0) {
          resolve(code);
        } else {
          reject(code);
        }
      });

      docker.on('exit', (data) => {
        console.log('*** exit ***');
        console.log(data);
      });

      // exec(`PROJECT_PATH=${pathToFolder} ${PATH_TO_RUN_CONTAINER_SCRIPT}`, (error) => {
      //   if (error) {
      //     reject(error);
      //   } else {
      //     resolve('ok');
      //   }
      // });
    });
  }

  async processBuild(pathToFolder: string, id: string) {
    try {
      console.log(await this.runContainer(pathToFolder));
    } catch (error) {
      console.log(error);
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
