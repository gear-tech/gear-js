import React, { FC, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import './BlocksList.scss';
import { RPC_METHODS } from '../../../consts';
import { fetchBlockAction } from '../../../store/actions/actions';
import { BlockModel } from '../../../types/block';
import { AppContext } from '../../../contexts/AppContext';

const BlocksList: FC<{ blocks: BlockModel[] }> = ({ blocks }) => {
  const showMoreClick = () => {
    const list = document.querySelector('.programs-list--short-list');
    list?.classList.remove('programs-list--short-list');
    const showMoreBtn = document.querySelector('.block-list__button');
    if ( showMoreBtn !== null ) {
      showMoreBtn.classList.add('block-list__button--hidden');
    }
  };

  return (
    <div className="block-list">
      <h3 className="block-list__header">Recent blocks: {blocks.length && blocks[0].number}</h3>
      {
        blocks && blocks.length
        &&
        (<>
          <ul className="programs-list programs-list--short-list">
            {
              blocks && blocks.length && blocks.map((block) => (
                <li className="programs-list__item" key={block.number}>
                  <span className="programs-list__number">{block.number}</span>
                  <span className="programs-list__name">{block.hash}</span>
                </li>
              ))
            }
          </ul>
          <button className="block-list__button" type="button" onClick={showMoreClick}>Show more</button>
        </>)
        ||
        (<div className="no-message">There are no blocks</div>)
      }
    </div>
  );
};

const BlockListContainer: FC = () => {
  const dispatch = useDispatch();
  const { rpcBroker } = useContext(AppContext);

  const { blocks } = useSelector((state: RootState) => state.blocks);

  useEffect(() => {
    let blocksSubId = '';
    if (!blocksSubId) {
      blocksSubId = rpcBroker!.subscribe({ method: RPC_METHODS.SUBSCRIBE_BLOCKS }, (res) => {
        dispatch(fetchBlockAction(res as BlockModel));
        // TODO: find out the reason of this
        // if (Object.prototype.hasOwnProperty.call(data.result, 'uploadedAt')) {
        //   alert('Meta data uploaded');
        // }
      });
    }

    return () => {
      if (blocksSubId) {
        rpcBroker?.unsubscribe(blocksSubId, RPC_METHODS.UNSUBSCRIBE_BLOCKS);
      }
    };
  }, [rpcBroker, dispatch]);

  return <BlocksList blocks={blocks} />;
};

export { BlockListContainer as BlocksList };
