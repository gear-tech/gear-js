import { useBlocks } from 'hooks';
import './BlocksList.scss';

export const BlockList = () => {
  const blocks = useBlocks();

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
                  <span className="programs-list__time">{block.time}</span>
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
