import { Icon } from 'components/ui/icon';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';
import { StoreItemCard } from 'components/cards/store-item-card';
import { useContext, useEffect, useState } from 'react';
import { TmgContext } from 'app/context';
import { StoreNFTItem } from 'app/types/tamagotchi-state';

export const StoreSection = () => {
  const { state } = useContext(TmgContext);
  const [items, setItems] = useState<StoreNFTItem[]>([]);

  useEffect(() => {
    const attr = state?.store?.attributes;
    if (attr) {
      setItems(Object.values(attr));
    }
  }, [state?.store?.attributes]);

  return (
    <>
      <h1 className="text-2xl font-kanit font-bold">Store</h1>
      <ul className="mt-8 mb-10 grid grid-cols-3 gap-8">
        {items.map((item, i) => (
          <li key={i}>
            <StoreItemCard item={item} />
          </li>
        ))}
      </ul>
      <div className="mt-auto">
        <Link to="/" className={clsx('btn gap-2 whitespace-nowrap', buttonStyles.light)}>
          <Icon name="left-arrow" className="w-5 h-5" />
          Back
        </Link>
      </div>
    </>
  );
};
