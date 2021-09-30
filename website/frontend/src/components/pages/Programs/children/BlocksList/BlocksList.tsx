import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import './BlocksList.scss';
import { UnsubscribePromise } from '@polkadot/api/types';
import { fetchBlockAction } from '../../../../../store/actions/actions';
import { BlockModel } from '../../../../../types/block';
import { useApi } from '../../../../../hooks/useApi';

const BlocksList: FC<{ blocks: BlockModel[] }> = ({ blocks }) => {
  const showMoreClick = () => {
    const list = document.querySelector('.programs-list--short-list');
    list?.classList.remove('programs-list--short-list');
    const showMoreBtn = document.querySelector('.block-list__button');
    if (showMoreBtn !== null) {
      showMoreBtn.classList.add('block-list__button--hidden');
    }
  };

  return (
    <div className="block-list">
      <h3 className="block-list__header">Recent blocks: {blocks.length && blocks[0].number}</h3>
      {(blocks && blocks.length && (
        <>
          <ul className="programs-list programs-list--short-list">
            {blocks &&
              blocks.length &&
              blocks.map((block) => (
                <li className="programs-list__item" key={block.number}>
                  <span className="programs-list__number">{block.number}</span>
                  <span className="programs-list__name">{block.hash}</span>
                </li>
              ))}
          </ul>
          <button className="block-list__button" type="button" onClick={showMoreClick}>
            Show more
          </button>
        </>
      )) || <div className="no-message">There are no blocks</div>}
    </div>
  );
};

const BlockListContainer: FC = () => {
  const dispatch = useDispatch();
  // const { rpcBroker } = useContext(AppContext);

  const { blocks } = useSelector((state: RootState) => state.blocks);

  const [api] = useApi();

  useEffect(() => {
    let unsub: UnsubscribePromise | null = null;

    if (api) {
      unsub = api.gearEvents.subscribeNewBlocks((event) => {
        dispatch(
          fetchBlockAction({
            hash: event.hash.toHex(),
            number: event.number.toNumber(),
          })
        );
      });
    }
    return () => {
      if (unsub) {
        (async () => {
          (await unsub)();
        })();
      }
    };
  }, [api, dispatch]);

  return <BlocksList blocks={blocks} />;
};

export { BlockListContainer as BlocksList };
