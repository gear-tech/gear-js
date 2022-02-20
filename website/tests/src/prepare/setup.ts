import { exec } from 'child_process';

export default async function () {
  console.log('** Setup ***');
  return new Promise((resolve, reject) =>
    exec('chmod +x download-examples.sh', (error, stdout) => {
      if (error) {
        reject(error.message);
      }
      console.log(stdout);
      exec('./download-examples.sh', (error, stdout) => {
        if (error) {
          reject(error.message);
        }
        console.log(stdout);
        resolve(0);
      });
    }),
  );
}
