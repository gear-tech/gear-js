export const getTamagotchiAge = (v: string) => {
  const seconds = Math.floor((Date.now() - +v) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  return days > 1 ? `${days} days` : '1 day';
};
