export const ColorVariants = ['primary', 'secondary'] as const;
export type ColorVariant = typeof ColorVariants[number];

export const ControlSizes = ['small'] as const;
export type ControlSize = typeof ControlSizes[number];
