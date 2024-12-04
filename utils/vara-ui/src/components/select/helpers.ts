const selectSizes = ['default', 'medium', 'small'] as const;
type ISelectSizes = (typeof selectSizes)[number];

export { selectSizes };
export type { ISelectSizes };
