import { Injectable, Logger } from '@nestjs/common';

import * as Docker from 'dockerode';
import { join } from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { StorageService } from './storage/storage.service';
import { isWasm, packZip } from './util';

@Injectable()
export class AppService {
  private docker: Docker;

  constructor(private readonly storage: StorageService) {
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    exec('./wasm-build/build-image.sh', (error, stdout, stderr) => {
      console.log(stderr);
    });
  }

  async runContainer(pathToFolder: string, id: string) {
    return new Promise((resolve, reject) => {
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
        (err, _, container) => {
          if (err) {
            container.remove();
            reject(err);
          } else {
            container.logs({ stderr: true, stdout: true }, (_, data: Buffer) => {
              const error = this.findErr(data.toString());
              if (error) {
                container.remove();
                reject(error);
              } else {
                container.remove();
                resolve(0);
              }
            });
          }
        },
      );
    });
  }

  async processBuild(pathToFolder: string, id: string) {
    try {
      await this.runContainer(pathToFolder, id);
    } catch (error) {
      return { error: error.message ? error.message : error };
    }
    const dirWithWasm = pathToFolder;

    const resultFiles = [];

    fs.readdirSync(dirWithWasm)
      .filter(isWasm)
      .map((fileName) => {
        resultFiles.push({
          content: fs.readFileSync(join(dirWithWasm, fileName)),
          fileName: fileName,
        });
      });
    if (resultFiles.length === 0) {
      await this.storage.save(null, id);
    } else {
      const file = packZip(resultFiles);
      await this.storage.save(file, id);
    }
    fs.rmdir(pathToFolder, { recursive: true }, () => {});
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
