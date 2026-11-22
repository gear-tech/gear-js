import { Button, Input } from '@gear-js/ui';
import { type FormEvent, useState } from 'react';

import {
  isRetiredVaraTestnet,
  LOCAL_ENDPOINT,
  LocalStorage,
  MAINNET_ENDPOINT,
  NODE_ADRESS_URL_PARAM,
  RETIRED_NETWORK_MESSAGE,
} from '@/shared/config';
import { isNodeAddressValid } from '@/shared/helpers';
import { useNodes } from '@/widgets/menu/helpers/useNodes';

import styles from './network-selection.module.scss';

function NetworkSelection() {
  const { nodeSections } = useNodes();
  const [selected, setSelected] = useState('');
  const [custom, setCustom] = useState('');
  const endpoint = (selected === 'custom' ? custom : selected).trim();
  const isValid = isNodeAddressValid(endpoint) && !isRetiredVaraTestnet(endpoint);
  const endpoints = [
    ...new Set([
      MAINNET_ENDPOINT,
      LOCAL_ENDPOINT,
      ...nodeSections.flatMap(({ nodes }) => nodes.map(({ address }) => address)),
    ]),
  ];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!isValid) return;

    localStorage.setItem(LocalStorage.Node, endpoint);
    localStorage.removeItem(LocalStorage.Genesis);

    const url = new URL(window.location.href);
    url.searchParams.set(NODE_ADRESS_URL_PARAM, endpoint);
    window.location.replace(url.toString());
  };

  return (
    <main className={styles.container}>
      <h1>Select a network</h1>
      <p role="alert">{RETIRED_NETWORK_MESSAGE}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="supported-network">Network</label>
        <select id="supported-network" value={selected} onChange={(event) => setSelected(event.target.value)}>
          <option value="">Choose a network</option>
          {endpoints.map((address) => (
            <option key={address} value={address}>
              {address === MAINNET_ENDPOINT ? 'Vara mainnet' : address === LOCAL_ENDPOINT ? 'Local node' : address}
            </option>
          ))}
          <option value="custom">Custom node</option>
        </select>
        {selected === 'custom' && (
          <Input label="Node WebSocket URL" value={custom} onChange={(event) => setCustom(event.target.value)} />
        )}
        <Button type="submit" text="Connect to selected network" disabled={!isValid} />
      </form>
    </main>
  );
}

export { NetworkSelection };
