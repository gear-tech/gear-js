export function isJSON(data: unknown) {
  try {
    JSON.parse(data as string);
  } catch (error) {
    try {
      if (JSON.stringify(data)[0] !== '{') {
        return false;
      }
    } catch (error) {
      return false;
    }
    return true;
  }
  return true;
}

export function toJSON(data: unknown) {
  try {
    return JSON.parse(data as string);
  } catch (error) {
    return data;
  }
}
