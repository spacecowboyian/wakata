import { LitElement, css, html, nothing } from 'lit';

export type WkLinkVariant = 'inline' | 'standalone';

/** Browsers ignore leading whitespace/control characters when parsing a scheme. */
function isUnsafeHref(href: string): boolean {
  // eslint-disable-next-line no-control-regex
  return /^(?:javascript|data|vbscript):/i.test(href.replace(/[\u0000-\u0020]/g, ''));
}

/** Navigation link wrapping a native anchor. Without a safe href it renders plain text. */
export class WkLink extends LitElement {
  static override properties = {
    href: { type: String },
    target: { type: String },
    rel: { type: String },
    variant: { type: String, reflect: true },
  };

  declare href: string | null;
  declare target: string | null;
  declare rel: string | null;
  declare variant: WkLinkVariant;

  constructor() {
    super();
    this.href = null;
    this.target = null;
    this.rel = null;
    this.variant = 'inline';
  }

  static override styles = css`
    :host {
      display: inline;
      font-family: inherit;
    }
    :host([variant='standalone']) {
      display: inline-block;
      max-width: 100%;
    }
    a,
    span {
      overflow-wrap: anywhere;
    }
    a {
      color: var(--wk-accent, #0645ad);
      text-decoration: underline;
      text-underline-offset: 0.15em;
    }
    :host([variant='standalone']) a {
      font-weight: 600;
    }
    a:hover,
    :host([variant='standalone']) a:focus-visible {
      text-decoration: underline;
    }
    a:focus-visible {
      outline: 2px solid var(--wk-focus, currentColor);
      outline-offset: 2px;
      border-radius: var(--wk-radius, 0px);
    }
  `;

  /** The href actually rendered, or null when the link is plain text. */
  get effectiveHref(): string | null {
    const href = this.href?.trim();
    return href && !isUnsafeHref(href) ? href : null;
  }

  /** The rel actually rendered; target=_blank always carries noopener and noreferrer. */
  get effectiveRel(): string | null {
    const tokens = (this.rel ?? '').split(/\s+/).filter(Boolean);
    if (this.target?.toLowerCase() === '_blank') {
      for (const required of ['noopener', 'noreferrer']) {
        if (!tokens.some((t) => t.toLowerCase() === required)) tokens.push(required);
      }
    }
    return tokens.length ? tokens.join(' ') : null;
  }

  override render() {
    const href = this.effectiveHref;
    if (!href) return html`<span part="text"><slot></slot></span>`;
    return html`<a
      part="link"
      href=${href}
      target=${this.target || nothing}
      rel=${this.effectiveRel ?? nothing}
      ><slot></slot
    ></a>`;
  }
}
