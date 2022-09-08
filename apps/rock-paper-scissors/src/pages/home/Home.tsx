import { ReactComponent as LizardSVG } from 'assets/images/backgrounds/lizard.svg';
import { Start } from './start';
import { Create } from './create';
import { Game } from './game';
import { Details } from './details';
import { RoundResult } from './round-result';

function Home() {
  return (
    <>
      <RoundResult name="name" game="2" round="3" />
      {/* <Details
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
      /> */}
      {/* <Game heading="name" stage="progress" bet="bet" game="game" round="round" /> */}
      {/* <Start /> */}
      {/* <Create /> */}
    </>
  );
}

export { Home };
