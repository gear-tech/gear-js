import express, { Request, Response, Express, json } from 'express';
import multer from 'multer';
import { generateId, unpackZip } from './util';
import { DBService } from './db';
import { CompilerService } from './compiler';
import config from './configuration';
import { resolve } from 'path';

const upload = multer();

export class Server {
  dbService: DBService;
  compiler: CompilerService;
  app: Express;

  constructor(dbService: DBService, compiler: CompilerService) {
    this.dbService = dbService;
    this.compiler = compiler;
    this.app = express();
    this.app.use(json());
  }

  setRoutes() {
    this.app.post('/wasm-compiler/build', upload.single('file'), async (req: Request, res: Response) => {
      const file = req.file;
      if (!file) {
        return res.sendStatus(400);
      }
      try {
        const id = generateId();
        const path = unpackZip(file.buffer, id);
        this.compiler.compile(resolve(path), id).catch((error) => {
          console.log(error);
        });
        return res.json(await this.dbService.newBuild(id));
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
    });

    this.app.post('/wasm-compiler/get-wasm', async ({ body }: Request, res: Response) => {
      if (!body?.id) {
        return res.sendStatus(400);
      }
      try {
        const result = await this.dbService.getFile(body.id);
        return res.json(result);
      } catch (error) {
        return res.sendStatus(404);
      }
    });
  }

  run() {
    this.app.listen(config.server.port, () => console.log(`Server is running on port ${config.server.port} 🚀`));
  }
}
