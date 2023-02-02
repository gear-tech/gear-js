import { getTamagotchiAge } from 'app/utils/get-tamagotchi-age';
import type { TamagotchiState } from 'app/types/lessons';
import { useAccount } from '@gear-js/react-hooks';

export const TamagotchiBattleInfoCard = ({ tamagotchi }: { tamagotchi: TamagotchiState }) => {
  const { account } = useAccount();
  return (
    <div className="flex gap-12 items-center p-4 bg-[#292929] rounded-2xl w-fit">
      <div className="basis-[415px] w-full px-8 py-6 bg-[#1E1E1E] rounded-2xl">
        <div className="flex justify-between gap-4">
          <h2 className="typo-h2 text-primary truncate">{tamagotchi.name}</h2>
        </div>
        <div className="mt-8 text-white text-lg font-medium">
          <table className="block w-full text-left">
            <tbody className="block space-y-8">
              <tr className="flex gap-8">
                <th className="flex-1 w-40 text-white text-opacity-70 font-medium">Owner ID:</th>
                <td className="flex-1 w-40 truncate">
                  {account?.decodedAddress === tamagotchi.owner ? account?.meta.name : tamagotchi.owner}
                </td>
              </tr>
              <tr className="flex gap-8">
                <th className="flex-1 w-40 text-white text-opacity-70 font-medium">Age:</th>
                <td className="flex-1 w-40">{getTamagotchiAge(tamagotchi.dateOfBirth)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
