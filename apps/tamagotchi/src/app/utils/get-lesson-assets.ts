import txt1 from 'assets/meta/meta1.txt';
import txt2 from 'assets/meta/meta2.txt';
import txt3 from 'assets/meta/meta3.txt';

type Props = { tamagotchi: RequestInfo | URL; };
export function getLessonAssets(lesson: number) {
  const getAssets = (): Props => {
    switch (lesson) {
      case 1:
        console.log('selected lesson 1');
        return { tamagotchi: txt1 };
      case 2:
        console.log('selected lesson 2');
        return { tamagotchi: txt2 };
      case 3:
        console.log('selected lesson 3');
        return { tamagotchi: txt3 };
      case 4:
        console.log('selected lesson 4');
        return { tamagotchi: txt3 };
      default:
        console.log('selected default');
        return { tamagotchi: txt1 };
    }
  };
  return getAssets();
}
