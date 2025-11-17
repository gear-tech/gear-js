// Convert decoded event log to typed object
export function convertEventParams<T>(event: any): T {
  const result: any = {};

  // For viem decoded events, args is already an object/array
  if (event.args) {
    if (Array.isArray(event.args)) {
      // If args is an array, we need the fragment to map to names
      // For now, just return the args as-is
      return event.args as T;
    } else {
      // If args is already an object, return it
      return event.args as T;
    }
  }

  return result as T;
}
