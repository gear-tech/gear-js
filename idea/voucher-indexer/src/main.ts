import { runProcessor } from './processor';
import { Server } from './server';
import { VoucherService } from './service';

const main = async () => {
  const voucherService = new VoucherService();
  await voucherService.init();

  const server = new Server(voucherService);

  server.start();

  runProcessor();
};

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
