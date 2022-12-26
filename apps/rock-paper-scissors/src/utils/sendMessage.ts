import { Hex } from '@gear-js/api';
import { stringToU8a } from '@polkadot/util';
import { blake2AsHex } from '@polkadot/util-crypto';
import { UserMoveType } from 'types';

const onClickRegister = (
  routeChange: (arg: string) => void,
  payloadSend: any,
  lobbyList: Hex[],
  accountHex: Hex,
  betSize: string,
) => {
  if (lobbyList?.includes(accountHex as never)) {
    return routeChange('game');
  }
  const replacedBetSize = betSize?.replace(',', '');
  payloadSend(
    { Register: null },
    {
      onSuccess: () => {
        routeChange('game');
      },
      value: replacedBetSize,
    },
  );
};

const onSubmitMove = (routeChange: (arg: string) => void, payloadSend: any, userMove: UserMoveType, pass: string) => {
  if (pass && Object.keys(userMove).length > 0) {
    const outputPass = userMove.id + pass;
    const payload = blake2AsHex(outputPass, 256);
    payloadSend(
      { MakeMove: payload },
      {
        onSuccess: () => {
          routeChange('game');
        },
      },
    );
  }
};

const onSubmitReveal = (routeChange: (arg: string) => void, payloadSend: any, userMove: string, password: string) => {
  if (userMove && password) return;
  const outputPass = stringToU8a(`${userMove}${password}`);
  payloadSend(
    { Reveal: Array.from(outputPass) },
    {
      onSuccess: () => {
        routeChange('round result');
      },
    },
  );
};

// const onEndGame = () => {
//   payloadSend(
//     { StopGame: null },
//     { onSuccess: () => { console.log('Game OvEr'); onClickRouteChange('') } })
// };

export { onSubmitReveal, onSubmitMove, onClickRegister };
