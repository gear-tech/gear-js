import Docker from 'dockerode';
import { exec } from 'child_process';
import { readdirSync, readFileSync, rmdir } from 'fs';
import { isWasm, packZip } from './util';
import { DBService } from './db';
import { join } from 'path';
import Dockerode from 'dockerode';

const PATH_TO_BUILD_IMAGE_SCRIPT = './wasm-build/build-image.sh';

export class CompilerService {
  docker: Docker;
  dbService: DBService;

  constructor(dbService: DBService) {
    this.dbService = dbService;
    this.docker = new Dockerode();
  }

  async buildImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(PATH_TO_BUILD_IMAGE_SCRIPT, (error, stdout, stderr) => {
        if (stderr) {
          console.log(stderr);
        }
        if (error) {
          console.log(error);
          reject(error);
        }
        console.log(stdout);
        return resolve('ok');
      });
    });
  }

  async runContainer(pathToFolder: string, id: string) {
    return new Promise((resolve, reject) => {
      exec('PROJECT_PATH=test ./wasm-build/run-container.sh');
      this.docker.run(
        'wasm-build',
        ['sh', '-c', './build.sh'],
        process.stdout,
        {
          Tty: false,
          name: id,
          HostConfig: {
            Binds: [`${pathToFolder}:/wasm-build/build`],
          },
          AttachStderr: true,
          WorkingDir: '/wasm-build',
        },
        {},
        (err, container) => {
          if (err) {
            container.remove();
            reject(err);
          } else {
            container.logs(
              { stderr: true, stdout: true },
              (_, data: Buffer) => {
                const error = this.findErr(data.toString());
                if (error) {
                  container.remove();
                  reject(error);
                } else {
                  container.remove();
                  resolve(0);
                }
              },
            );
          }
        },
      );
    });
  }

  async processBuild(pathToFolder: string, id: string) {
    try {
      await this.runContainer(pathToFolder, id);
    } catch (error) {
      return this.dbService.update(id, null, error.message);
    }
    const dirWithWasm = pathToFolder;

    const resultFiles = [];

    readdirSync(dirWithWasm)
      .filter(isWasm)
      .map((fileName) => {
        resultFiles.push({
          content: readFileSync(join(dirWithWasm, fileName)),
          fileName: fileName,
        });
      });
    if (resultFiles.length === 0) {
      this.dbService.update(id, null, null);
    } else {
      const file = packZip(resultFiles);
      this.dbService.update(id, file);
    }
    rmdir(pathToFolder, { recursive: true }, () => {});
    return 0;
  }

  private findErr(stdout: string) {
    const splited: Array<string> = stdout.split('error: ');
    if (splited.length > 1) {
      if (splited[0].match('error')) {
        return splited[0].split('error')[1].split('\n')[0];
      }
      return splited[1].split('\n')[0];
    } else return null;
  }
}
