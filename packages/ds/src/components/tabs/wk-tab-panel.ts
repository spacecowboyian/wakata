import { LitElement, css, html } from 'lit';

/**
 * Panel child of `wk-tabs`, paired with the tab of the same `value`. The parent
 * sets `role="tabpanel"`, the label relationship and visibility.
 */
export class WkTabPanel extends LitElement {
  static override properties = {
    value: { type: String, reflect: true },
  };

  declare value: string;

  constructor() {
    super();
    this.value = '';
  }

  static override styles = css`
    :host {
      display: block;
      padding: 1em 0;
      font-family: var(--wk-font, inherit);
      color: var(--wk-text, inherit);
      overflow-wrap: anywhere;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:focus-visible) {
      outline: 2px solid var(--wk-focus, currentColor);
      outline-offset: 2px;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}
