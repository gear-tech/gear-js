import { Start } from './start';
import { Create } from './create';
import { Game } from './game';
import { Details } from './details';

function Home() {
  return (
    <>
      {/* <Details heading="name" /> */}
      <Game heading="name" stage="progress" bet="bet" game="game" round="round" />
      {/* <Start /> */}
      {/* <Create /> */}
    </>
  );
}

export { Home };
