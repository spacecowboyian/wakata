import { LionButtonSubmit } from '@lion/ui/button.js';
import {
  applyAppearanceDefaults,
  wkButtonAppearanceProperties,
  type WkButtonAppearance,
} from './wk-button-appearance.js';
import type { WkButtonIntent, WkButtonSize, WkButtonVariant } from './wk-button.js';
import { wkButtonStyles } from './wk-button.styles.js';

/**
 * Submit button built on LionButtonSubmit: submits the closest native `<form>` ancestor in the
 * same DOM tree, including implicit submission from fields. No `loading` state yet
 * (see docs/ds/issue-8-contract.md).
 *
 * @tag wk-button-submit
 */
export class WkButtonSubmit extends LionButtonSubmit implements WkButtonAppearance {
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
