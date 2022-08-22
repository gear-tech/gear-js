export function getNameDapp(fullName: string): string {
  const chars = fullName.split("");
  let indexLastIndex;

  for (let i = 0; i < chars.length; i++) {
    if (Number(chars[i]) || Number(chars[i]) === 0) {
      indexLastIndex = i - 1;
      break;
    }
  }

  return fullName.substr(0, indexLastIndex);
}
