import request from './request';
import { GearKeyring, getWasmMetadata, Hex } from '@gear-js/api';
import { expect } from 'chai';
import { IPreparedPrograms } from 'interfaces';
import { readFileSync } from 'fs';
import accounts from 'config/accounts';

export async function getAllPrograms(genesis: string, expected: Hex[]) {
  const response = await request('program.all', { genesis });
  expect(response).to.have.own.property('result');
  expect(response.result.count).to.eq(expected.length);

  response.result.programs
    .map((program: any) => program.id)
    .forEach((programId: Hex) => {
      expect(expected).to.contains(programId);
    });
}

export async function getProgramData(genesis: string, programId: string) {
  const response = await request('program.data', { genesis, programId });
  expect(response).to.have.own.property('result');
  expect(response).to.have.all.keys('id', 'owner', 'name', 'uploadedAt', 'meta', 'title', 'initStatus');
}

export async function uploadMeta(genesis: string, programs: IPreparedPrograms) {
  const accs = await accounts();
  for (let preparedProgram of Object.values(programs)) {
    const metaFile = readFileSync(preparedProgram.spec.pathToMeta);
    const meta = await getWasmMetadata(metaFile);
    const data = {
      genesis,
      programId: preparedProgram.id,
      meta,
      metaFile,
      name: preparedProgram.name,
      title: `Test ${preparedProgram.name}`,
      signature: GearKeyring.sign(accs[preparedProgram.spec.account], JSON.stringify(meta)),
    };
    const response = await request('program.meta.add', data);
    expect(response).to.eq('Metadata added');
  }
}

export async function getMeta(genesis: string, programsIds: string[]) {
  for (let id of programsIds) {
    const data = {
      genesis,
      programId: id,
    };
    const response = await request('program.meta.get', data);
    expect(response).not.to.have.property('result');
    expect(response).to.have.all.keys('program', 'meta', 'metaFile');
  }
}
