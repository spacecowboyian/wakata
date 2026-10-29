import type { ReactiveController, ReactiveControllerHost } from 'lit';

interface ErrorHost extends ReactiveControllerHost, HTMLElement {
  error: string;
  showsFeedbackFor?: string[];
  addToAriaDescribedBy(
    element: HTMLElement,
    options?: { idPrefix?: string; reorder?: boolean },
  ): void;
  removeFromAriaDescribedBy(element: HTMLElement): void;
}

/** External validation text for boolean controls, without scalar-string event behavior. */
export class WkBooleanErrorController implements ReactiveController {
  #node?: HTMLElement;
  #lastError = '';

  constructor(
    private readonly host: ErrorHost,
    private readonly target: () => HTMLElement | null,
  ) {
    host.addController(this);
  }

  hostConnected(): void {
    this.host.addEventListener('showsFeedbackForChanged', this.#onFeedbackChange);
    this.host.requestUpdate();
  }

  hostDisconnected(): void {
    this.host.removeEventListener('showsFeedbackForChanged', this.#onFeedbackChange);
    this.#clear();
    this.#lastError = '';
  }

  hostUpdated(): void {
    if (this.host.error !== this.#lastError) {
      this.#lastError = this.host.error;
      if (this.host.error) this.#render();
      else this.#clear();
    }
    this.#syncInvalid();
  }

  #onFeedbackChange = (event: Event): void => {
    if (event.target === this.host) this.#syncInvalid();
  };

  #syncInvalid(): void {
    if (this.host.error) this.target()?.setAttribute('aria-invalid', 'true');
  }

  #render(): void {
    if (!this.#node) {
      this.#node = document.createElement('div');
      this.#node.slot = 'after';
      this.#node.setAttribute('data-wk-external-error', '');
      this.host.append(this.#node);
      // Preserve the explicit association across Lion's slot-order updates.
      this.host.addToAriaDescribedBy(this.#node, { idPrefix: 'external-error', reorder: false });
    }
    this.#node.textContent = this.host.error;
    this.target()?.setAttribute('aria-invalid', 'true');
  }

  #clear(): void {
    if (!this.#node) return;
    this.host.removeFromAriaDescribedBy(this.#node);
    this.#node.remove();
    this.#node = undefined;
    this.target()?.setAttribute(
      'aria-invalid',
      String(Boolean(this.host.showsFeedbackFor?.includes('error'))),
    );
  }
}
