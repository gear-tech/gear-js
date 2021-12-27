import { GearService } from './gear';
import { KafkaConsumer } from './kafka.consumer';
import { DbService } from './db';

const main = async () => {
  const db = new DbService();
  await db.connect();
  const gear = new GearService(db);
  await gear.connect();
  const kafka = new KafkaConsumer(gear, db);
  await kafka.connect();
  kafka.subscribe(`testBalance.get`);
};

main();
