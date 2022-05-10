import { GearService } from './gear';
import { KafkaConsumer } from './kafka.consumer';
import { DbService } from './db';
import { changeStatus } from './healthcheck';

const main = async () => {
  const db = new DbService();
  await db.connect();
  changeStatus('database');
  const gear = new GearService(db);
  await gear.connect();
  changeStatus('ws');
  const kafka = new KafkaConsumer(gear, db);
  await kafka.connect();
  kafka.subscribe(`testBalance.get`);
  changeStatus('kafka');
};

main();
