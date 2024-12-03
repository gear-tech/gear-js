export const checkboxSizes = ['sm', 'md'] as const;
export type ICheckboxSizes = (typeof checkboxSizes)[number];

export const checkboxTypes = ['switch', 'checkbox'] as const;
export type ICheckboxTypes = (typeof checkboxTypes)[number];
