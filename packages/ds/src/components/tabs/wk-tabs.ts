import { LitElement, css, html, type PropertyValues } from 'lit';
import { WkTab } from './wk-tab.js';
import { WkTabPanel } from './wk-tab-panel.js';

export interface WkTabsChangeDetail {
  value: string;
}

let uid = 0;

/**
 * Provisional horizontal tabs with manual activation (Lit; Lion's tabs cannot
 * separate focus from selection). Tabs and panels pair by `value`, never by
 * position. ArrowLeft/ArrowRight/Home/End move focus only; Enter, Space and
 * click select and emit one bubbling, composed `wk-change` ({ value }).
 * Programmatic `value` changes emit nothing. A missing or unmatched `value`
 * normalizes to the first enabled tab with a matching panel.
 *
 * @slot tab - `wk-tab` children
 * @slot panel - `wk-tab-panel` children
 * @fires wk-change
 */
export class WkTabs extends LitElement {
  static override properties = {
    value: { type: String, reflect: true },
    label: { type: String },
  };

  declare value: string;
  /** Accessible name for the tablist. */
  declare label: string | null;

  private _focused: WkTab | null = null;
  private _scheduled = false;
  private _observer = new MutationObserver(() => this._schedule());
  private readonly _id = `wk-tabs-${++uid}`;

  constructor() {
    super();
    this.value = '';
    this.label = null;
    this.addEventListener('keydown', this._onKeydown);
    this.addEventListener('click', this._onClick);
    this.addEventListener('focusin', this._onFocusin);
    this.addEventListener('focusout', this._onFocusout);
  }

  static override styles = css`
    :host {
      display: block;
      font-family: var(--wk-font, inherit);
    }
    .tablist {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25em;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['value', 'disabled', 'slot'],
    });
    this._schedule();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._observer.disconnect();
  }

  override render() {
    return html`<div
        class="tablist"
        role="tablist"
        aria-orientation="horizontal"
        aria-label=${this.label ?? ''}
        part="tablist"
      >
        <slot name="tab" @slotchange=${this._schedule}></slot>
      </div>
      <div class="panels" part="panels">
        <slot name="panel" @slotchange=${this._schedule}></slot>
      </div>`;
  }

  protected override updated(changed: PropertyValues) {
    if (changed.has('value')) this._sync();
  }

  private get _tabs(): WkTab[] {
    return Array.from(this.children).filter(
      (c): c is WkTab => c instanceof WkTab && c.slot === 'tab',
    );
  }

  private get _panels(): WkTabPanel[] {
    return Array.from(this.children).filter(
      (c): c is WkTabPanel => c instanceof WkTabPanel && c.slot === 'panel',
    );
  }

  private _navigable(tabs = this._tabs, panels = this._panels): WkTab[] {
    const panelValues = new Set(panels.map((p) => p.value));
    const seen = new Set<string>();
    return tabs.filter((tab) => {
      if (tab.disabled || !tab.value || !panelValues.has(tab.value) || seen.has(tab.value)) {
        return false;
      }
      seen.add(tab.value);
      return true;
    });
  }

  private _effective(tabs: WkTab[]): WkTab | null {
    const nav = this._navigable(tabs);
    return nav.find((t) => t.value === this.value) ?? nav[0] ?? null;
  }

  private _schedule = () => {
    if (this._scheduled) return;
    this._scheduled = true;
    queueMicrotask(() => {
      this._scheduled = false;
      this._sync();
    });
  };

  private _sync() {
    const tabs = this._tabs;
    const panels = this._panels;
    const nav = this._navigable(tabs, panels);
    const selected = nav.find((tab) => tab.value === this.value) ?? nav[0] ?? null;
    const canonicalValue = selected?.value ?? '';
    if (this.value !== canonicalValue) this.value = canonicalValue;
    const lostFocusedTab = this._focused && !nav.includes(this._focused);
    if (lostFocusedTab) this._focused = null;
    const stop = this._focused ?? selected;
    const panelFor = new Map<string, WkTabPanel>();
    for (const p of panels) {
      if (p.value !== '' && !panelFor.has(p.value)) panelFor.set(p.value, p);
    }
    // First tab for a value owns the pairing; later duplicates are inert.
    const owners = new Map<string, WkTab>();
    for (const t of tabs) if (t.value !== '' && !owners.has(t.value)) owners.set(t.value, t);
    tabs.forEach((tab, i) => {
      if (!tab.id) tab.id = `${this._id}-tab-${i}`;
      const inert = !nav.includes(tab) && !tab.disabled;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(tab === selected));
      tab.setAttribute('aria-disabled', String(tab.disabled || inert));
      tab.tabIndex = tab === stop ? 0 : -1;
      const panel = inert ? undefined : panelFor.get(tab.value);
      if (panel) {
        if (!panel.id) panel.id = `${this._id}-panel-${panels.indexOf(panel)}`;
        tab.setAttribute('aria-controls', panel.id);
      } else {
        tab.removeAttribute('aria-controls');
      }
    });
    for (const p of panels) {
      const owner = owners.get(p.value);
      const active = !!selected && owner === selected && panelFor.get(p.value) === p;
      p.setAttribute('role', 'tabpanel');
      if (owner && panelFor.get(p.value) === p) p.setAttribute('aria-labelledby', owner.id);
      else p.removeAttribute('aria-labelledby');
      p.hidden = !active;
      if (active) p.tabIndex = 0;
      else p.removeAttribute('tabindex');
    }
    if (lostFocusedTab && selected) selected.focus();
  }

  private _tabFrom(e: Event): WkTab | null {
    const t = (e.target as Element | null)?.closest?.('wk-tab');
    return t instanceof WkTab && t.parentElement === this ? t : null;
  }

  private _select(tab: WkTab) {
    if (!this._navigable().includes(tab)) return;
    const before = this._effective(this._tabs);
    this._focused = tab;
    this.value = tab.value;
    this._sync();
    if (before !== tab) {
      this.dispatchEvent(
        new CustomEvent<WkTabsChangeDetail>('wk-change', {
          detail: { value: tab.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  private _onClick = (e: Event) => {
    const tab = this._tabFrom(e);
    if (tab) this._select(tab);
  };

  private _onFocusin = (e: Event) => {
    const tab = this._tabFrom(e);
    if (tab && !tab.disabled && tab !== this._focused) {
      this._focused = tab;
      this._sync();
    }
  };

  private _onFocusout = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && this._tabs.some((t) => t === next || t.contains(next))) return;
    this._focused = null;
    this._sync();
  };

  private _onKeydown = (e: KeyboardEvent) => {
    const tab = this._tabFrom(e);
    if (!tab || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!e.repeat) this._select(tab);
      return;
    }
    const nav = this._navigable();
    if (!nav.length) return;
    const i = nav.indexOf(tab);
    if (i < 0) return;
    let next: WkTab | undefined;
    if (e.key === 'ArrowRight') next = nav[(i + 1) % nav.length];
    else if (e.key === 'ArrowLeft') next = nav[(i - 1 + nav.length) % nav.length];
    else if (e.key === 'Home') next = nav[0];
    else if (e.key === 'End') next = nav[nav.length - 1];
    else return;
    if (!next) return;
    e.preventDefault();
    this._focused = next;
    this._sync();
    next.focus();
  };
}
