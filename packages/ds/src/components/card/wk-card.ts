import { LitElement, css, html } from 'lit';

/** Presentational container with optional heading and actions sections. */
export class WkCard extends LitElement {
  static override styles = css`
    :host {
      box-sizing: border-box;
      display: block;
      min-width: 0;
      max-width: 100%;
      padding: 16px;
      border: 1px solid var(--wk-border, #999);
      border-radius: var(--wk-radius, 0px);
      background: var(--wk-surface, #fff);
      color: var(--wk-text, #222);
      font-family: var(--wk-font, Arial, Helvetica, sans-serif);
    }
    .sections {
      display: grid;
      gap: 12px;
      min-width: 0;
    }
    .section {
      min-width: 0;
    }
    .section[hidden] {
      display: none;
    }
    ::slotted([slot='heading']) {
      margin: 0;
      overflow-wrap: anywhere;
    }
  `;

  override firstUpdated(): void {
    this.#syncSections();
  }

  #syncSections = (): void => {
    for (const selector of ['slot[name="heading"]', 'slot:not([name])', 'slot[name="actions"]']) {
      const slot = this.renderRoot.querySelector<HTMLSlotElement>(selector);
      if (slot?.parentElement) {
        const hasContent = slot
          .assignedNodes({ flatten: true })
          .some((node) => node.nodeType === Node.ELEMENT_NODE || Boolean(node.textContent?.trim()));
        slot.parentElement.hidden = !hasContent;
      }
    }
  };

  override render() {
    return html`
      <div class="sections">
        <div class="section" hidden>
          <slot name="heading" @slotchange=${this.#syncSections}></slot>
        </div>
        <div class="section" hidden>
          <slot @slotchange=${this.#syncSections}></slot>
        </div>
        <div class="section" hidden>
          <slot name="actions" @slotchange=${this.#syncSections}></slot>
        </div>
      </div>
    `;
  }
}
