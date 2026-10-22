export const wkThemes = ['neutral', 'studio', 'fieldwork'] as const;
export const wkModes = ['light', 'dark'] as const;
export type WkTheme = (typeof wkThemes)[number];
export type WkMode = (typeof wkModes)[number];
