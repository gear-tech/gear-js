export function isJSON(data: any) {
  try {
    JSON.parse(data);
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

export function toJSON(data: any) {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}
