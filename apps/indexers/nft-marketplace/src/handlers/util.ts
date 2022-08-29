import { Store } from '@subsquid/typeorm-store';
import { Account } from '../model';

export async function getAcc(id: string, store: Store): Promise<Account> {
  let acc = await store.findOneBy(Account, { id });
  if (!acc) {
    acc = new Account({ id, tokens: [] });
    await store.save(acc);
  }
  return acc;
}
