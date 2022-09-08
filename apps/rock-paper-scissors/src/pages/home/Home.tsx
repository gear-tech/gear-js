import { ReactComponent as LizardSVG } from 'assets/images/backgrounds/lizard.svg';
import { Start } from './start';
import { Create } from './create';
import { Game } from './game';
import { Details } from './details';

function Home() {
  return (
    <>
      <Details
        heading="name"
        bet="bet"
        game="game"
        round="round"
        contract="0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d"
        players="10"
        entry="10"
        move="05"
        reveal="10"
        SVG={LizardSVG}
      />
      {/* <Game heading="name" stage="progress" bet="bet" game="game" round="round" /> */}
      {/* <Start /> */}
      {/* <Create /> */}
    </>
  );
}

export { Home };
