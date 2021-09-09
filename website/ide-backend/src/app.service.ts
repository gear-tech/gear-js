import { Injectable, Logger } from '@nestjs/common';
const AdmZip = require('adm-zip');
const Docker = require('dockerode');
import { join } from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';

@Injectable()
export class AppService {
  private docker: any;
  private rootFolder: string;

  constructor(private readonly config: ConfigService) {
    this.rootFolder = this.config.get('IDE_FOLDER');
    this.docker = new Docker({ socketPath: '/var/run/docker.sock' });
    exec('./wasm-build/build-image.sh', (error, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
    });
  }

  async runContainer(pathToFolder) {
    return new Promise((resolve, reject) => {
      this.docker.run(
        'wasm-build',
        ['sh', '-c', 'ls && cp ../build.sh ./ && ./build.sh'],
        process.stdout,
        {
          Tty: false,
          name: Math.random().toString(36).substring(10),
          HostConfig: {
            Binds: [
              `${pathToFolder}:/wasm-build/build`,
            ],
          },
          AttachStderr: true,
          WorkingDir: '/wasm-build/build',
        },
        {},
        (err, data, container) => {
          if (err) {
            container.remove();
            reject(err);
          } else {
            container.logs(
              { stderr: true, stdout: true },
              (err, data: Buffer) => {
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

  async processBuild(pathToFolder) {
    try {
      const result = await this.runContainer(pathToFolder);
    } catch (error) {
      return { error: error.message ? error.message : error };
    }
    const dirWithWasm = pathToFolder;

    const resultFiles = [];

    fs.readdirSync(dirWithWasm)
      .filter(this.isWasm)
      .map((fileName) => {
        resultFiles.push({
          content: fs.readFileSync(join(dirWithWasm, fileName)),
          fileName: fileName,
        });
      });
    let result: any;
    if (resultFiles.length === 0) {
      result = { error: 'Build failed' };
    } else {
      result = { file: this.packZip(resultFiles) };
    }

    fs.rmdir(
      `/${join(...pathToFolder.split('/').slice(0, -1))}`,
      { recursive: true },
      () => {},
    );

    return result;
  }

  private isWasm(fileName: string) {
    let ext = fileName.split('.');
    return ext[ext.length - 1] === 'wasm';
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

  unpackZip(file: Buffer, projectName: string, username: string) {
    const zip = new AdmZip(file);
    const path = join(this.rootFolder, username, projectName);
    fs.mkdirSync(path, { recursive: true });
    zip.extractAllTo(path);
    return path;
  }

  packZip(files) {
    const zip = new AdmZip();
    files.forEach((file) => {
      zip.addFile(
        file.fileName,
        Buffer.alloc(file.content.length, file.content),
      );
    });
    return zip.toBuffer();
  }
}
