import { Start } from './start';
import { Create } from './create';
import { Game } from './game';

function Home() {
  return (
    <>
      <Game name="name" stage="progress" bet="bet" game="game" round="round" />
      {/* <Start /> */}
      {/* <Create /> */}
    </>
  );
}

export { Home };
