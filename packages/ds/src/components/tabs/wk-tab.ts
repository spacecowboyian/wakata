import { LitElement, css, html } from 'lit';

/**
 * Tab child of `wk-tabs`. The host carries `role="tab"`, tab stop and selected
 * state (set by the parent); the label is its slotted content.
 */
export class WkTab extends LitElement {
  static override properties = {
    value: { type: String, reflect: true },
    disabled: { type: Boolean, reflect: true },
  };

  declare value: string;
  declare disabled: boolean;

  constructor() {
    super();
    this.value = '';
    this.disabled = false;
  }

  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      box-sizing: border-box;
      max-width: 100%;
      min-height: 44px;
      padding: 0.5em 1em;
      font-family: var(--wk-font, inherit);
      color: var(--wk-text, inherit);
      background: var(--wk-surface, transparent);
      border: 1px solid var(--wk-border, currentColor);
      border-radius: var(--wk-radius, 0px);
      cursor: pointer;
      overflow-wrap: anywhere;
      user-select: none;
    }
    :host([aria-selected='true']) {
      color: var(--wk-on-accent, inherit);
      background: var(--wk-accent, currentColor);
      border-color: var(--wk-accent, currentColor);
      font-weight: 600;
    }
    :host(:focus-visible) {
      outline: 2px solid var(--wk-focus, currentColor);
      outline-offset: 2px;
    }
    :host([disabled]) {
      color: var(--wk-disabled-text, GrayText);
      background: var(--wk-disabled-bg, transparent);
      border-color: var(--wk-disabled-border, currentColor);
      border-style: dashed;
      cursor: not-allowed;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}
