const textareaSizes = ['default', 'medium', 'small'] as const;
type ITextareaSizes = (typeof textareaSizes)[number];

export { textareaSizes };
export type { ITextareaSizes };
