import { LitElement, css, html, nothing } from 'lit';

export type WkStatusVariant = 'informational' | 'success' | 'warning' | 'danger';
export type WkStatusLive = 'polite' | 'assertive';

/**
 * Non-interactive status message. Meaning is carried by the slotted text; the
 * optional `icon` slot is decorative and hidden from accessibility APIs.
 * No live region unless `live` is explicitly `polite` or `assertive`.
 */
export class WkStatus extends LitElement {
  static override properties = {
    variant: { type: String, reflect: true },
    live: { type: String, reflect: true },
  };

  declare variant: WkStatusVariant;
  declare live: WkStatusLive | null;

  constructor() {
    super();
    this.variant = 'informational';
    this.live = null;
  }

  static override styles = css`
    :host {
      display: inline-block;
      max-width: 100%;
      font-family: var(--wk-font, inherit);
    }
    .status {
      --_c: var(--wk-accent, currentColor);
      display: flex;
      align-items: flex-start;
      gap: 0.5em;
      box-sizing: border-box;
      padding: 0.375em 0.75em;
      color: var(--wk-text, inherit);
      background: var(--wk-surface, transparent);
      border: 1px solid var(--_c);
      border-inline-start-width: 4px;
      border-radius: var(--wk-radius, 0px);
      overflow-wrap: anywhere;
    }
    :host([variant='success']) .status {
      --_c: var(--wk-positive, currentColor);
    }
    :host([variant='danger']) .status {
      --_c: var(--wk-danger, currentColor);
    }
    /* No warning token exists: warning is distinguished by a dashed border and its text. */
    :host([variant='warning']) .status {
      --_c: var(--wk-text, currentColor);
      border-style: dashed;
    }
    .icon {
      flex: none;
      color: var(--_c);
    }
    .icon[hidden] {
      display: none;
    }
  `;

  get effectiveVariant(): WkStatusVariant {
    return ['success', 'warning', 'danger'].includes(this.variant) ? this.variant : 'informational';
  }

  get effectiveLive(): WkStatusLive | null {
    return this.live === 'polite' || this.live === 'assertive' ? this.live : null;
  }

  private _hasIcon = false;

  private _onIconSlot(e: Event) {
    const has = (e.target as HTMLSlotElement).assignedNodes().length > 0;
    if (has !== this._hasIcon) {
      this._hasIcon = has;
      this.requestUpdate();
    }
  }

  override render() {
    const live = this.effectiveLive;
    const role = live === 'assertive' ? 'alert' : live === 'polite' ? 'status' : nothing;
    return html`<div class="status" part="status" role=${role}>
      <span class="icon" part="icon" aria-hidden="true" ?hidden=${!this._hasIcon}
        ><slot name="icon" @slotchange=${this._onIconSlot}></slot></span
      ><span class="text" part="text"><slot></slot></span>
    </div>`;
  }
}
