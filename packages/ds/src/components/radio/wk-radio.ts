import { LionRadio } from '@lion/ui/radio-group.js';
import { wkRadioStyles } from './wk-radio.styles.js';

/**
 * One option of `wk-radio-group` on LionRadio with a native light-DOM radio input. Submits
 * `choiceValue` under the group name only when checked and enabled. `checked` is the default
 * selection. Use inside `wk-radio-group`; it emits no events of its own.
 *
 * @tag wk-radio
 */
export class WkRadio extends LionRadio {
  static override get styles() {
    return [...LionRadio.styles, wkRadioStyles];
  }
}
