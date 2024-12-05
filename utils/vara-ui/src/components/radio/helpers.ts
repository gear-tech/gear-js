const radioSizes = ['default', 'small'] as const;
type IRadioSizes = (typeof radioSizes)[number];

export { radioSizes };
export type { IRadioSizes };
