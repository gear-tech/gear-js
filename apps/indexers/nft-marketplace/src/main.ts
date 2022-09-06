import { marketplaceInit, nftInit, run } from './processor';

const main = async () => {
  await nftInit;
  await marketplaceInit;
  run();
};

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
