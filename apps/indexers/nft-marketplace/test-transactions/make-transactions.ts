import {
  decodeAddress,
  GasInfo,
  GearApi,
  GearKeyring,
  getWasmMetadata,
  Hex,
  MessageEnqueuedData,
  Metadata,
} from '@gear-js/api';
import assert from 'assert';
import { readFileSync } from 'fs';
import yaml from 'yaml';
import dotenv from 'dotenv';
dotenv.config();

const config = yaml.parse(readFileSync('./workflow.yaml', 'utf-8'));

interface IProgramConfig {
  opt: string;
  meta: string;
  acc: string;
  payload: any;
}

interface IMessageConfig {
  program: Hex;
  acc: string;
  payload: any;
  value?: number;
}

async function getAccount(accountName: string) {
  switch (accountName) {
    case 'alice':
      return GearKeyring.fromSuri('//Alice');
    case 'bob':
      return GearKeyring.fromSuri('//Bob');
    default:
      const seed = process.env[accountName.toUpperCase()] as string;
      assert.notStrictEqual(seed, undefined, `Unable to find ${accountName} seed in environment variables`);
      return GearKeyring.fromSeed(seed);
  }
}

function increaseGasIfNeeded(gas: GasInfo) {
  return gas.waited ? gas.min_limit.add(gas.min_limit.muln(0.1)) : gas.min_limit;
}

function sendTransaction(tx: any, account: any): Promise<string> {
  return new Promise((resolve, reject) =>
    tx.signAndSend(account, ({ events, status }): any => {
      events.forEach(({ event: { method, data } }): any => {
        if (method === 'MessageEnqueued' && status.isFinalized) {
          const eventData = data as MessageEnqueuedData;
          resolve(eventData.id.toHex());
        } else if (method === 'ExtrinsicFailed') {
          reject(data.toString());
        }
      });
    }),
  );
}

class Gear {
  api: GearApi;
  processedSuccessfully: (messageId: string) => boolean;

  async init(providerAddress?: string) {
    this.api = await GearApi.create({ providerAddress });
    this.processedSuccessfully = this.listenToMessagesDispatched();
  }

  listenToMessagesDispatched() {
    const messages = new Map<string, boolean>();
    this.api.gearEvents.subscribeToGearEvent('MessagesDispatched', ({ data: { statuses } }) => {
      statuses.forEach((value, key) => {
        messages.set(key.toHex(), value.isSuccess);
      });
    });
    return (messageId: string) => {
      if (!messages.has(messageId)) {
        throw new Error('Unable to find message status');
      }
      return messages.get(messageId) as boolean;
    };
  }

  async upload_program(program: IProgramConfig): Promise<{ id: Hex; metadata: Metadata }> {
    const code = readFileSync(program.opt);
    const metaWasm = readFileSync(program.meta);
    const metadata = await getWasmMetadata(metaWasm);
    const account = await getAccount(program.acc);
    const gasLimit = await this.api.program.calculateGas.initUpload(
      decodeAddress(account.address),
      code,
      program.payload,
      0,
      false,
      metadata,
    );
    const { programId } = this.api.program.upload(
      {
        code,
        initPayload: program.payload,
        gasLimit: increaseGasIfNeeded(gasLimit),
      },
      metadata,
    );

    const messageId: string = await sendTransaction(this.api.program, account);
    assert.strictEqual(
      this.processedSuccessfully(messageId),
      true,
      `Failed during program uploading ${JSON.stringify(program.payload, undefined, 2)}`,
    );
    return { id: programId, metadata };
  }

  async sendMessage({ program, acc, payload, value }: IMessageConfig, metadata: Metadata) {
    const account = await getAccount(acc);
    const gasLimit = await this.api.program.calculateGas.handle(
      decodeAddress(account.address),
      program,
      payload,
      value,
      false,
      metadata,
    );

    const tx = this.api.message.send(
      {
        destination: program,
        payload,
        gasLimit: increaseGasIfNeeded(gasLimit),
        value,
      },
      metadata,
    );

    const messageId: string = await sendTransaction(tx, account);
    assert.strictEqual(
      this.processedSuccessfully(messageId),
      true,
      `Failed during sending message ${JSON.stringify(payload, undefined, 2)}`,
    );
  }
}

function logStep() {
  let step = 1;
  const out = process.stdout;
  return () => {
    out.clearLine(0);
    out.cursorTo(0);
    out.write(`step: ${step}`);
    step++;
  };
}

const main = async () => {
  const gear = new Gear();
  const providerAddress = process.argv[2];
  await gear.init(providerAddress);

  const { programs, steps } = config;
  const uploadedPrograms = new Map<number, { id: Hex; metadata: Metadata }>();

  const regex = { program: /_program-\d/, account: /_account-\w*/ };

  async function replaceAliasInPayload(payload) {
    const _string = JSON.stringify(payload);
    let match;
    if (regex.program.test(_string)) {
      match = _string.match(regex.program);
      const prog = uploadedPrograms.get(Number(match[0].split('-')[1]))!.id;
      return JSON.parse(_string.replace(regex.program, prog));
    }
    if (regex.account.test(_string)) {
      match = _string.match(regex.account);
      const acc = decodeAddress((await getAccount(match[0].split('-')[1])).address);
      return JSON.parse(_string.replace(regex.account, acc));
    }

    return payload;
  }

  const log = logStep();
  for (const step of steps) {
    log();
    if (step.timeout) {
      await new Promise((resolve) => {
        setTimeout(resolve, step.timeout);
      });
      continue;
    }
    if (step.tx === 'upload_program') {
      const result = await gear.upload_program(programs[step.program]);
      uploadedPrograms.set(step.program, result);
    }

    if (step.tx === 'send_message') {
      const program = uploadedPrograms.get(step.program);
      const payload = await replaceAliasInPayload(step.payload);
      await gear.sendMessage(
        { program: program!.id, acc: step.acc as string, payload, value: step.value },
        program!.metadata,
      );
    }
  }

  console.log(uploadedPrograms)
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
