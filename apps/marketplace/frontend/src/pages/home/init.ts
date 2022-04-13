import kitty100 from 'assets/images/placeholders/kitty100.svg';
import kitty101 from 'assets/images/placeholders/kitty101.svg';
import kitty200 from 'assets/images/placeholders/kitty200.svg';
import doggy100 from 'assets/images/placeholders/doggy100.svg';
import bear from 'assets/images/placeholders/bear.svg';

const filters = ['All', 'Buy now', 'On auction', 'New', 'Has offers'];

const cards = [
  { image: kitty100, collection: 'Cryptokitty', name: 'Kitty #100', value: 10, isAuction: true },
  { image: kitty101, collection: 'Cryptokitty', name: 'Kitty #101', value: 100, isAuction: false },
  { image: doggy100, collection: 'Doge', name: 'Doggy #100', value: 10, isAuction: true },
  { image: bear, collection: 'Bear', name: 'Fancy bear', value: 100, isAuction: false },
  { image: kitty200, collection: 'Cryptokitty', name: 'Kitty #200', value: 10, isAuction: false },
];

export { filters, cards };
