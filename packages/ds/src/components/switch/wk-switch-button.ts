import { css } from 'lit';
import { LionSwitchButton } from '@lion/ui/switch.js';

/** Token-styled switch control. LionSwitch creates this inside its scoped registry. */
export class WkSwitchButton extends LionSwitchButton {
  static override get styles() {
    return [
      ...LionSwitchButton.styles,
      css`
        :host {
          display: inline-flex;
          box-sizing: border-box;
          width: 52px;
          height: 44px;
          align-items: center;
          cursor: pointer;
        }
        .btn {
          box-sizing: border-box;
          width: 52px;
          height: 28px;
          border: 2px solid var(--wk-text, #222);
          border-radius: 999px;
          background: var(--wk-surface, #fff);
        }
        .switch-button__track {
          width: 100%;
          height: 100%;
          border-radius: inherit;
          background: transparent;
        }
        .switch-button__thumb {
          box-sizing: border-box;
          top: 3px;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--wk-text, #222);
        }
        :host([checked]) .switch-button__thumb {
          right: 3px;
          left: auto;
        }
        :host(:focus-visible) .btn {
          outline: 2px solid var(--wk-focus, #111);
          outline-offset: 2px;
        }
        :host([disabled]) {
          cursor: not-allowed;
        }
        :host([disabled]) .btn {
          border-color: var(--wk-disabled-border, #ddd);
        }
        :host([disabled]) .switch-button__thumb {
          background: var(--wk-disabled-text, #777);
        }
        @media (forced-colors: active) {
          .btn {
            border-color: CanvasText;
          }
          .switch-button__thumb {
            background: CanvasText;
          }
          :host(:focus-visible) .btn {
            outline-color: Highlight;
          }
        }
      `,
    ];
  }
}
