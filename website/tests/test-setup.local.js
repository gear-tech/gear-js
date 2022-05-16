const { DataSource } = require('typeorm');
const { Program, Message, Meta } = require('../data-storage/src/entities');
const config = require('./src/config/base').default;
const { exec } = require('child_process');

module.exports = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.name,
    synchronize: true,
    entities: [Program, Message, Meta],
  });
  await dataSource.initialize();
  await dataSource.getRepository(Program).delete({});
  await dataSource.getRepository(Message).delete({});
  await dataSource.getRepository(Meta).delete({});
  await new Promise((resolve, reject) =>
    exec('./download-examples.sh', (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    }),
  );
};
