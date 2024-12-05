const inputSizes = ['default', 'medium', 'small'] as const;
type IInputSizes = (typeof inputSizes)[number];

export { inputSizes };
export type { IInputSizes };
