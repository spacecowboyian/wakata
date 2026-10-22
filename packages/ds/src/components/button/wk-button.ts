import { LionButton } from '@lion/ui/button.js';
import type { PropertyValues } from 'lit';
import { wkButtonStyles } from './wk-button.styles.js';

export type WkButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type WkButtonIntent = 'normal' | 'positive' | 'danger';
export type WkButtonSize = 'small' | 'medium' | 'large';

/**
 * Action button built on LionButton. Form submit/reset are deliberately separate future components.
 * Activation is the native `click` event; no custom activation event is dispatched.
 *
 * @tag wk-button
 */
export class WkButton extends LionButton {
  static override get properties() {
    return {
      ...super.properties,
      variant: { type: String, reflect: true },
      intent: { type: String, reflect: true },
      size: { type: String, reflect: true },
      loading: { type: Boolean, reflect: true },
    };
  }

  static override get styles() {
    return [...super.styles, wkButtonStyles];
  }

  /** Visual emphasis. */
  declare variant: WkButtonVariant;
  /** Semantic intent. */
  declare intent: WkButtonIntent;
  /** Control size. */
  declare size: WkButtonSize;
  /** Busy state: keeps label, size and tab stop but blocks activation. */
  declare loading: boolean;

  constructor() {
    super();
    this.variant = 'secondary';
    this.intent = 'normal';
    this.size = 'medium';
    this.loading = false;
    this.addEventListener(
      'click',
      (event) => {
        if (this.disabled || this.loading) {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      true,
    );
  }

  override click(): void {
    if (!this.loading) super.click();
  }

  override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (this.loading) this.setAttribute('aria-busy', 'true');
    else this.removeAttribute('aria-busy');
    if (this.disabled || this.loading) this.setAttribute('aria-disabled', 'true');
    else this.removeAttribute('aria-disabled');
  }
}
