import { LionButtonReset } from '@lion/ui/button.js';
import {
  applyAppearanceDefaults,
  wkButtonAppearanceProperties,
  type WkButtonAppearance,
} from './wk-button-appearance.js';
import type { WkButtonIntent, WkButtonSize, WkButtonVariant } from './wk-button.js';
import { wkButtonStyles } from './wk-button.styles.js';

/**
 * Reset button built on LionButtonReset: resets the closest native `<form>` ancestor in the
 * same DOM tree. No `loading` state yet (see docs/ds/issue-8-contract.md).
 *
 * @tag wk-button-reset
 */
export class WkButtonReset extends LionButtonReset implements WkButtonAppearance {
  static override get properties() {
    return { ...super.properties, ...wkButtonAppearanceProperties };
  }

  static override get styles() {
    return [...super.styles, wkButtonStyles];
  }

  declare variant: WkButtonVariant;
  declare intent: WkButtonIntent;
  declare size: WkButtonSize;

  constructor() {
    super();
    applyAppearanceDefaults(this);
  }
}
