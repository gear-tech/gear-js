const MULTIPLIER = { MS: 1000, S: 60, M: 60, H: 24, D: 30 };

function getMilliseconds(value: number, unit: 'hour' | 'day' | 'month') {
  const UNIT_MULTIPLIER = {
    hour: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M,
    day: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H,
    month: MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H * 30,
  };

  return value * UNIT_MULTIPLIER[unit];
}

const getPluralizedUnit = (value: number, unit: string) => `${value} ${unit}${value > 1 ? 's' : ''}`;

function getTime(ms: number) {
  const minutes = Math.floor((ms / (MULTIPLIER.MS * MULTIPLIER.S)) % MULTIPLIER.M);
  const hours = Math.floor((ms / (MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M)) % MULTIPLIER.H);
  const days = Math.floor(ms / (MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H)) % MULTIPLIER.D;
  const months = Math.floor(ms / (MULTIPLIER.MS * MULTIPLIER.S * MULTIPLIER.M * MULTIPLIER.H * MULTIPLIER.D));

  let result = '';

  if (months) result += getPluralizedUnit(months, 'month') + ' ';
  if (days) result += getPluralizedUnit(days, 'day') + ' ';
  if (hours) result += getPluralizedUnit(hours, 'hour') + ' ';
  if (minutes) result += getPluralizedUnit(minutes, 'minute');

  return result.trim();
}

const getOptions = (blockTimeMs: number) => {
  const DURATION_UNIT = {
    HOUR: 'hour',
    DAY: 'day',
    MONTH: 'month',
  } as const;

  const DURATION_OPTIONS = [
    { value: 1, unit: DURATION_UNIT.HOUR },
    { value: 3, unit: DURATION_UNIT.HOUR },
    { value: 6, unit: DURATION_UNIT.HOUR },
    { value: 12, unit: DURATION_UNIT.HOUR },
    { value: 1, unit: DURATION_UNIT.DAY },
    { value: 7, unit: DURATION_UNIT.DAY },
    { value: 14, unit: DURATION_UNIT.DAY },
    { value: 1, unit: DURATION_UNIT.MONTH },
    { value: 2, unit: DURATION_UNIT.MONTH },
  ];

  return DURATION_OPTIONS.map(({ value, unit }) => {
    const ms = getMilliseconds(value, unit);
    const blocks = Math.ceil(ms / blockTimeMs);

    return { value: blocks.toString(), label: getPluralizedUnit(value, unit) };
  });
};

const getCustomOption = (duration: number, blockTimeMs: number) => {
  const milliseconds = blockTimeMs * duration;
  const time = getTime(milliseconds);

  return { label: time, value: duration, disabled: true };
};

export { getOptions, getCustomOption };
