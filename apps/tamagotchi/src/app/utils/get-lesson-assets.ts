import txt1 from 'assets/meta/meta1.txt';
import txt2 from 'assets/meta/meta2.txt';
import txt3 from 'assets/meta/meta3.txt';
import txt4 from 'assets/meta/meta4.txt';
// import txt5 from 'assets/meta/meta5.txt';
import txt6 from 'assets/meta/meta6.txt';

export function getLessonAssets(lesson: number): RequestInfo | URL {
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
      return txt4;
    case 5:
      console.log('selected lesson 5');
      return txt4;
    case 6:
      console.log('selected lesson 6');
      return txt6;
    default:
      console.log('selected default');
      return txt1;
  }
}
