export function getNameDapp(fullName: string): string {
  const chars = fullName.split("");
  let firstNumIndex;

  for (let i = 0; i < chars.length; i++) {
    if (Number(chars[i]) || Number(chars[i]) === 0) {
      firstNumIndex = i - 1;
      break;
    }
  }

  return fullName.slice(0, firstNumIndex);
}
