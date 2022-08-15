import { OnLogin, InfoText } from 'components';
import { Welcome } from './welcome';
import { Feeds } from './feeds';

function Home() {
  return (
    <OnLogin fallback={<InfoText text="Wellcome! To start to use Worksop App please Log In" />}>
      <Welcome />
      <Feeds />
    </OnLogin>
  );
}

export { Home };
