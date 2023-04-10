export const ACC_REGEX = /\$account \w+/g;
export const PROG_REGEX = /\$program \d+/g;
export const CODE_REGEX = /\$code \d+/g;
export const CLI_REGEX = /\$cli \w+/g;

export function replaceMatch(
  src: string,
  matchArr: RegExpMatchArray,
  replaceObj: Record<string, any>,
  takeKey?: string,
  inApplyFn?: (v: any) => any,
  enApplyFn?: (v: any) => any,
): string {
  for (const match of matchArr) {
    const [matchKey, matchValue] = match.split(' ');
    let result = replaceObj[inApplyFn ? inApplyFn(matchValue) : matchValue];
    if (result === undefined) {
      console.log(matchKey, matchValue, replaceObj);
      throw new Error(`Unable to get ${matchKey} by ${result}`);
    }

    if (takeKey) {
      result = result[takeKey];
    }
    if (enApplyFn) {
      result = enApplyFn(result);
    }
    src = src.replace(match, result);
  }
  return src;
}
