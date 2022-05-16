const { exec } = require('child_process');

module.exports = async () => {
  await new Promise((resolve, reject) =>
    exec('./download-examples.sh', (error) => {
      if (error) {
        reject(error);
      }
      resolve();
    }),
  );
};
