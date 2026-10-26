import type { WkButtonIntent, WkButtonSize, WkButtonVariant } from './wk-button.js';

export interface WkButtonAppearance {
  /** Visual emphasis. */
  variant: WkButtonVariant;
  /** Semantic intent. `danger` marks destructive actions. */
  intent: WkButtonIntent;
  /** Control size. */
  size: WkButtonSize;
}

/** Reactive property declarations shared by every Wakata button element. */
export const wkButtonAppearanceProperties = {
  variant: { type: String, reflect: true },
  intent: { type: String, reflect: true },
  size: { type: String, reflect: true },
} as const;

export function applyAppearanceDefaults(el: WkButtonAppearance): void {
  el.variant = 'secondary';
  el.intent = 'normal';
  el.size = 'medium';
}
