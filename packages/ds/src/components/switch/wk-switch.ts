import { LionSwitch } from '@lion/ui/switch.js';
import { wkSwitchStyles } from './wk-switch.styles.js';
import type { WkBooleanEventDetail } from '../checkbox/wk-boolean-events.js';
import { WkSwitchButton } from './wk-switch-button.js';

/**
 * Immediate-setting switch on LionSwitch. Not a native form control: no required, readonly or
 * submitted-value API. The label stays the same when state changes.
 *
 * @tag wk-switch
 * @fires wk-input - user activation; detail `{ checked, name, value }`
 * @fires wk-change - user activation; detail `{ checked, name, value }`
 */
export class WkSwitch extends LionSwitch {
  static override get scopedElements() {
    return { ...super.scopedElements, 'lion-switch-button': WkSwitchButton };
  }

  static override get styles() {
    return [...LionSwitch.styles, wkSwitchStyles];
  }

  #beforeActivation = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('click', this.#start, true);
    this.addEventListener('keyup', this.#start, true);
    this.addEventListener('click', this.#finish);
    this.addEventListener('keyup', this.#finish);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#start, true);
    this.removeEventListener('keyup', this.#start, true);
    this.removeEventListener('click', this.#finish);
    this.removeEventListener('keyup', this.#finish);
  }

  // Capture the state before Lion handles a click or keyboard activation. Reading it
  // again as the event bubbles avoids a timer and ignores programmatic writes.
  #start = (event: Event): void => {
    if (event instanceof KeyboardEvent && ![' ', 'Enter'].includes(event.key)) return;
    this.#beforeActivation = this.checked;
  };

  #finish = (event: Event): void => {
    if (event instanceof KeyboardEvent && ![' ', 'Enter'].includes(event.key)) return;
    if (this.checked === this.#beforeActivation) return;
    const detail: WkBooleanEventDetail = {
      checked: this.checked,
      name: this.name,
    };
    for (const type of ['wk-input', 'wk-change']) {
      this.dispatchEvent(
        new CustomEvent<WkBooleanEventDetail>(type, { bubbles: true, composed: true, detail }),
      );
    }
  };
}
