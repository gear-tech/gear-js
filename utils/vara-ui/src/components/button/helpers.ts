const buttonSizes = ['x-small', 'small', 'medium', 'default', 'x-large'] as const;
type IButtonSizes = (typeof buttonSizes)[number];

const buttonColors = ['primary', 'dark', 'light', 'grey', 'border', 'transparent', 'destructive'] as const;
type IButtonColors = (typeof buttonColors)[number];

export { buttonSizes, buttonColors };
export type { IButtonSizes, IButtonColors };
