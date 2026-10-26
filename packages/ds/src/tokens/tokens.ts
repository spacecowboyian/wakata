export interface WkToken {
  /** CSS custom property name. */
  readonly name: `--wk-${string}`;
  /** Fallback used by components when the token is not provided. */
  readonly fallback: string;
  readonly description: string;
}

/** Supported theme tokens. Theme authors set these on a theme root; components only read them. */
export const wkTokens = [
  { name: '--wk-font', fallback: 'Arial, Helvetica, sans-serif', description: 'Font family.' },
  { name: '--wk-radius', fallback: '0px', description: 'Control corner radius.' },
  { name: '--wk-text', fallback: '#222', description: 'Default text colour.' },
  { name: '--wk-surface', fallback: '#fff', description: 'Default control surface.' },
  { name: '--wk-border', fallback: '#999', description: 'Default control border.' },
  { name: '--wk-focus', fallback: '#111', description: 'Focus ring colour.' },
  { name: '--wk-accent', fallback: '#171717', description: 'Primary variant background.' },
  { name: '--wk-on-accent', fallback: '#fff', description: 'Text on the accent colour.' },
  {
    name: '--wk-positive',
    fallback: '#17623c',
    description: 'Positive/success feedback and status only; never a Button action.',
  },
  {
    name: '--wk-on-positive',
    fallback: '#fff',
    description: 'Text on the positive feedback colour.',
  },
  { name: '--wk-danger', fallback: '#a02222', description: 'Danger intent text and border.' },
  {
    name: '--wk-on-danger',
    fallback: '#fff',
    description: 'Text on the danger colour (primary danger).',
  },
  { name: '--wk-hover-mix', fallback: '#000', description: 'Colour mixed in on primary hover.' },
  { name: '--wk-disabled-bg', fallback: '#eee', description: 'Disabled background.' },
  { name: '--wk-disabled-text', fallback: '#777', description: 'Disabled text.' },
  { name: '--wk-disabled-border', fallback: '#ddd', description: 'Disabled border.' },
] as const satisfies readonly WkToken[];

export type WkTokenName = (typeof wkTokens)[number]['name'];
