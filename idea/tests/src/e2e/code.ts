import { Hex } from '@gear-js/api';
import { expect } from 'chai';

import { Passed } from '../interfaces';
import request from './request';

async function getCodes(genesis: string, codeIds: Hex[]): Promise<Passed> {
  const response = await request('code.all', { genesis, limit: 100 });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(['listCode', 'count']);
  expect(response.result.count).to.eq(codeIds.length);
  return true;
}

async function getCodesByDates(genesis: string, date: Date): Promise<Passed> {
  const fromDate = new Date(date);
  fromDate.setMinutes(fromDate.getMinutes() - 5);

  const toDate = new Date(date);
  toDate.setMinutes(toDate.getMinutes() + 5);

  const response = await request('code.all', { genesis, fromDate, toDate, limit: 100 });

  const isValidCodesData = response.result.listCode.reduce((arr, code: any) => {
    const createdProgramDate = new Date(code.timestamp);
    if (createdProgramDate > fromDate && createdProgramDate < toDate) {
      arr.push(true);
    } else {
      arr.push(false);
    }

    return arr;
  }, []);

  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys(['listCode', 'count']);
  expect(isValidCodesData.every((el) => el === true)).to.eq(true);
  return true;
}

async function getCodeData(genesis: string, codeId: Hex) {
  const response = await request('code.data', { genesis, codeId });
  expect(response).to.have.own.property('result');
  expect(response.result).to.have.all.keys([
    'id',
    '_id',
    'uploadedBy',
    'name',
    'hex',
    'status',
    'expiration',
    'genesis',
    'blockHash',
    'timestamp',
    'programs',
    'meta',
  ]);
  return true;
}

export { getCodes, getCodeData, getCodesByDates };
