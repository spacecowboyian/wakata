import type { ReactiveController, ReactiveControllerHost } from 'lit';

/** Detail of `wk-input` and `wk-change`. */
export interface WkFieldEventDetail {
  value: string;
  name: string;
}

/** The Lion field surface the controller relies on (all public Lion API). */
export interface WkFieldHost extends ReactiveControllerHost, HTMLElement {
  name: string;
  value: string;
  showsFeedbackFor?: string[];
  /** Server/external error text; empty means no external error. */
  error: string;
  addToAriaDescribedBy(element: HTMLElement, options?: { idPrefix?: string }): void;
  removeFromAriaDescribedBy(element: HTMLElement): void;
}

/**
 * Shared field behaviour for Wakata fields built on Lion fields:
 * - `wk-input` / `wk-change` typed events, driven by the native control's own `input` and
 *   `change` events, so programmatic writes and resets never emit them;
 * - an `error` property rendered as text in a Wakata-owned element (slot `after`), linked via
 *   Lion's public aria-describedby helpers and `aria-invalid`; works for empty and nonempty values
 *   and leaves Lion validation feedback and help text associations untouched.
 */
export class WkFieldController implements ReactiveController {
  #lastError = '';
  #node?: HTMLElement;

  constructor(private readonly host: WkFieldHost) {
    host.addController(this);
  }

  hostConnected(): void {
    this.host.addEventListener('input', this.#onNative);
    this.host.addEventListener('change', this.#onNative);
    this.host.addEventListener('showsFeedbackForChanged', this.#onFeedbackChange);
    // Disconnect cleanup removes our node; reconnect can otherwise have no Lit update.
    this.host.requestUpdate();
  }

  hostDisconnected(): void {
    this.host.removeEventListener('input', this.#onNative);
    this.host.removeEventListener('change', this.#onNative);
    this.host.removeEventListener('showsFeedbackForChanged', this.#onFeedbackChange);
    this.#clear();
    this.#lastError = '';
  }

  #input(): HTMLElement | null {
    return this.host.querySelector(':scope > [slot="input"]');
  }

  #clear(): void {
    if (!this.#node) return;
    this.host.removeFromAriaDescribedBy(this.#node);
    this.#node.remove();
    this.#node = undefined;
    // Lion owns aria-invalid for its own validation; hand it back reflecting only that state.
    this.#input()?.setAttribute(
      'aria-invalid',
      String(Boolean(this.host.showsFeedbackFor?.includes('error'))),
    );
  }

  hostUpdated(): void {
    if (this.host.error !== this.#lastError) {
      this.#lastError = this.host.error;
      this.#render();
    }
    // Lion can update validation without changing the external error text.
    this.#syncInvalid();
  }

  #syncInvalid(): void {
    if (this.host.error) this.#input()?.setAttribute('aria-invalid', 'true');
  }

  #onFeedbackChange = (event: Event): void => {
    // Lion reflects aria-invalid synchronously before this public notification.
    if (event.target === this.host) this.#syncInvalid();
  };

  #render(): void {
    const text = this.host.error;
    if (!text) return this.#clear();
    if (!this.#node) {
      this.#node = document.createElement('div');
      this.#node.slot = 'after';
      this.#node.setAttribute('data-wk-external-error', '');
      this.host.append(this.#node);
      this.host.addToAriaDescribedBy(this.#node, { idPrefix: 'external-error' });
    }
    this.#node.textContent = text;
    this.#input()?.setAttribute('aria-invalid', 'true');
  }

  #onNative = (event: Event): void => {
    const control = event.target;
    if (!(control instanceof HTMLElement) || control.parentElement !== this.host) return;
    if (control.getAttribute('slot') !== 'input') return;
    this.host.dispatchEvent(
      new CustomEvent<WkFieldEventDetail>(event.type === 'input' ? 'wk-input' : 'wk-change', {
        bubbles: true,
        composed: true,
        detail: {
          value: (control as HTMLInputElement).value,
          name: this.host.name,
        },
      }),
    );
  };
}
