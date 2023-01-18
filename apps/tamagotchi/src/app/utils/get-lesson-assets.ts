import txt1 from 'assets/meta/meta1.txt';
import txt2 from 'assets/meta/meta2.txt';
import txt3 from 'assets/meta/meta3.txt';

export function getLessonAssets(lesson: number) {
  const getAssets = (): RequestInfo | URL => {
    switch (lesson) {
      case 1:
        console.log('selected lesson 1');
        return txt1;
      case 2:
        console.log('selected lesson 2');
        return txt2;
      case 3:
        console.log('selected lesson 3');
        return txt3;
      case 4:
        console.log('selected lesson 4');
        return txt3;
      default:
        console.log('selected default');
        return txt1;
    }
  };
  return getAssets();
}
