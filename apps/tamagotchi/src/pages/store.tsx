import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { buttonStyles } from '@gear-js/ui';
import { useItemsStore } from 'app/hooks/use-store';
import { StoreItemCard } from 'components/cards/store-item-card';
import { Icon } from 'components/ui/icon';

export const Store = () => {
  const { items } = useItemsStore();
  return (
    <>
      <h1 className="text-2xl font-kanit font-bold">Store</h1>
      {items.length ? (
        <ul className="mt-8 mb-10 grid grid-cols-3 gap-8">
          {items.map((item, i) => (
            <li key={i}>
              <StoreItemCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="my-auto opacity-70 text-center">Items not found</p>
      )}
      <div className="mt-auto">
        <Link to="/" className={clsx('btn gap-2 whitespace-nowrap', buttonStyles.light)}>
          <Icon name="left-arrow" className="w-5 h-5" />
          Back
        </Link>
      </div>
    </>
  );
};
