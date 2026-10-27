import { LitElement, html } from 'lit';
import { wkModeSwitchStyles } from './wk-mode-switch.styles.js';

export type WkColorMode = 'system' | 'light' | 'dark';
export type WkResolvedColorMode = Exclude<WkColorMode, 'system'>;
export interface WkModeChangeDetail {
  mode: WkColorMode;
  resolvedMode: WkResolvedColorMode;
}

const storageKey = 'wakata:color-mode:v1';
const isMode = (value: unknown): value is WkColorMode =>
  value === 'system' || value === 'light' || value === 'dark';

// One choice per document, retained in memory even if storage is blocked.
class DocumentMode {
  mode: WkColorMode = 'system';
  readonly media: MediaQueryList;
  readonly listeners = new Set<(mode: WkColorMode) => void>();
  private readonly storage?: Storage;

  constructor(
    readonly document: Document,
    readonly window: Window,
  ) {
    this.media = window.matchMedia('(prefers-color-scheme: dark)');
    try {
      this.storage = window.localStorage;
      const saved = this.storage.getItem(storageKey);
      if (saved === 'light' || saved === 'dark') this.mode = saved;
      else if (saved !== null) console.warn('wk-mode-switch: ignoring invalid stored mode.');
    } catch (error) {
      console.warn('wk-mode-switch: storage unavailable; using in-memory mode.', error);
    }
  }

  get resolvedMode(): WkResolvedColorMode {
    return this.mode === 'system' ? (this.media.matches ? 'dark' : 'light') : this.mode;
  }

  readonly apply = () => {
    this.document.documentElement.setAttribute('data-wk-mode', this.resolvedMode);
    for (const listener of this.listeners) listener(this.mode);
  };

  readonly onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey && event.key !== null) return;
    if (!this.storage || event.storageArea !== this.storage) return;
    const value = event.newValue;
    if (value !== null && value !== 'light' && value !== 'dark') {
      console.warn('wk-mode-switch: ignoring invalid stored mode.');
      return;
    }
    this.mode = value ?? 'system';
    this.apply();
  };

  subscribe(listener: (mode: WkColorMode) => void) {
    if (!this.listeners.size) {
      this.media.addEventListener('change', this.apply);
      this.window.addEventListener('storage', this.onStorage);
    }
    this.listeners.add(listener);
    this.apply();
  }

  unsubscribe(listener: (mode: WkColorMode) => void) {
    this.listeners.delete(listener);
    if (!this.listeners.size) {
      this.media.removeEventListener('change', this.apply);
      this.window.removeEventListener('storage', this.onStorage);
    }
  }

  select(mode: WkColorMode) {
    this.mode = mode;
    try {
      if (mode === 'system') this.window.localStorage.removeItem(storageKey);
      else this.window.localStorage.setItem(storageKey, mode);
    } catch (error) {
      console.warn('wk-mode-switch: storage unavailable; keeping in-memory mode.', error);
    }
    this.apply();
  }
}

const documents = new WeakMap<Document, DocumentMode>();

/** Native supporting control, not a Lion form field. */
export class WkModeSwitch extends LitElement {
  static override properties = { mode: { type: String, reflect: true, noAccessor: true } };
  static override styles = wkModeSwitchStyles;

  private currentMode: WkColorMode = 'system';
  private explicitMode = false;
  private shared?: DocumentMode;

  get mode(): WkColorMode {
    return this.currentMode;
  }

  set mode(value: WkColorMode) {
    if (!isMode(value)) throw new TypeError('wk-mode-switch: mode must be system, light or dark.');
    if (this.shared) this.shared.select(value);
    else {
      this.explicitMode = true;
      this.receive(value);
    }
  }

  private readonly receive = (mode: WkColorMode) => {
    const previous = this.currentMode;
    this.currentMode = mode;
    this.requestUpdate('mode', previous);
  };

  override connectedCallback() {
    super.connectedCallback();
    const document = this.ownerDocument;
    let shared = documents.get(document);
    if (!shared) {
      shared = new DocumentMode(document, document.defaultView!);
      documents.set(document, shared);
    }
    this.shared = shared;
    if (this.explicitMode) shared.select(this.currentMode);
    this.explicitMode = false;
    shared.subscribe(this.receive);
    // Reflect the default even when it did not change.
    this.requestUpdate('mode', undefined);
  }

  override disconnectedCallback() {
    this.shared?.unsubscribe(this.receive);
    this.shared = undefined;
    super.disconnectedCallback();
  }

  private onChange(event: Event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.checked || !isMode(input.value)) return;
    this.mode = input.value;
    this.dispatchEvent(
      new CustomEvent<WkModeChangeDetail>('wk-mode-change', {
        bubbles: true,
        composed: true,
        detail: { mode: this.mode, resolvedMode: this.shared!.resolvedMode },
      }),
    );
  }

  override render() {
    return html`
      <fieldset @change=${this.onChange}>
        <legend>Colour mode</legend>
        <div class="choices">
          ${(['system', 'light', 'dark'] as const).map(
            (mode) => html`
              <label>
                <input type="radio" name="mode" value=${mode} .checked=${this.mode === mode} />
                ${mode[0]!.toUpperCase() + mode.slice(1)}
              </label>
            `,
          )}
        </div>
      </fieldset>
    `;
  }
}
