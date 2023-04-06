import { IScheme, SchemeProgram } from '../types';

function getValue(v: any) {
  return v;
}

export function validateScheme(scheme: IScheme) {
  const errors = [];
  if (scheme.fund_accounts && !scheme.prefunded_account) {
    errors.push("prefunded_account is not specified. It's required if you want to fund some account");
  }
  if (!scheme.accounts) scheme.accounts = {};
  if (!scheme.programs) scheme.programs = [];
  if (!scheme.codes) scheme.codes = [];
  if (!scheme.transactions) scheme.transactions = [];

  const accounts = [];
  const programs: Record<number, SchemeProgram> = {};
  const codeIds = [];

  for (const [name, seed] of Object.entries(scheme.accounts)) {
    if (typeof seed === 'number') {
      errors.push(`Account ${name} has invalid seed, its type must be a string`, { [name]: seed });
      continue;
    }
    accounts.push(name);
  }

  for (const program of scheme.programs) {
    if (program.id === undefined) {
      errors.push({ error: 'Program id is not specified', value: getValue(program) });
    }
    if (program.address) {
      if (typeof program.address === 'number') {
        errors.push(`Program ${program.id} has invalid address, its type must be a string`, program);
        continue;
      }
    }
    programs[program.id] = program;
    if (!program.path_to_wasm && !program.address) {
      errors.push({ error: 'Path to program is not specified.', value: getValue(program) });
    }
  }

  for (const code of scheme.codes) {
    if (code.id === undefined) {
      errors.push({ error: 'Code id is not specified.', value: getValue(code) });
    }
    codeIds.push(code.id);
    if (code.hash) continue;
    if (!code.name) {
      errors.push({ error: 'Code name is not specified.', value: getValue(code) });
    }
    if (!code.path_to_wasm) {
      errors.push({ error: 'Path to code is not specified.', value: getValue(code) });
    }
  }

  for (const transaction of scheme.transactions) {
    if (transaction.type === 'upload_program' || transaction.type === 'send_message') {
      if (transaction.program === undefined) {
        errors.push({ error: 'Program id is not specified.', value: getValue(transaction) });
      }
      if (!Object.keys(programs).includes(transaction.program.toString())) {
        errors.push({ error: `Program with id ${transaction.program} not found`, value: getValue(transaction) });
        continue;
      }
      if (programs[transaction.program].path_to_meta === undefined && transaction.payload_type === undefined) {
        errors.push({
          error: 'Metadata / type of payload is not specified for program / transaction',
          value: getValue(transaction),
        });
      }
    }
    if (transaction.type === 'upload_code') {
      if (transaction.code === undefined) {
        errors.push({ error: 'Code id is not specified.', value: getValue(transaction) });
      }
      if (!codeIds.includes(transaction.code)) {
        errors.push({ error: `Code with id ${transaction.code} not found`, value: getValue(transaction) });
      }
    }

    if (transaction.account === undefined) {
      errors.push({ error: 'Account is not specified.', value: getValue(transaction) });
    }

    if (!accounts.includes(transaction.account)) {
      errors.push({ error: 'Specified account for the transaction not listed.', value: getValue(transaction) });
    }
  }
  if (errors.length > 0) {
    return errors;
  }
  return null;
}
