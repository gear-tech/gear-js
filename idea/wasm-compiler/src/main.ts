import { CompilerService } from './compiler';
import { DBService } from './db';
import { Server } from './server';

const main = async () => {
  const dbService = new DBService();
  await dbService.connect();
  const compiler = new CompilerService(dbService);
  await compiler.buildImage();
  console.log('Image built');
  const server = new Server(dbService, compiler);
  server.setRoutes();
  server.run();
};

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
