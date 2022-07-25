import { verify } from 'hcaptcha';

import configuration from '../config/configuration';

const config = configuration();

const SECRET = config.server.captchaSecret;

export async function verifyCaptcha(token: string) {
  if (process.env.TEST_ENV) {
    return true;
  }
  const verfied = await verify(SECRET, token);
  if (verfied.success) {
    return true;
  }
  return false;
}
