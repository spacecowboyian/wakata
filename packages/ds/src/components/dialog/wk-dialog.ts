import { LionDialog } from '@lion/ui/dialog.js';
import type { OverlayConfig } from '@lion/ui/overlays.js';
import { css } from 'lit';
import type { PropertyDeclaration } from 'lit';
import { wkTokens } from '../../tokens/tokens.js';

const scopedAttributes = ['data-wk-theme', 'data-wk-mode', 'data-wk-wireframe'] as const;
const observedAttributes = [...scopedAttributes, 'class', 'style'];
const tokenNames = wkTokens.map(({ name }) => name);
const focusableSelector =
  'a[href], area[href], button, input:not([type="hidden"]), select, textarea, iframe, object, embed, [contenteditable="true"], [tabindex], [role="button"]';

type SavedInlineStyle = { value: string; priority: string };

/** Provisional modal dialog built on Lion's public dialog and overlay APIs. */
export class WkDialog extends LionDialog {
  static override styles = css`
    :host {
      display: contents;
    }
    dialog[data-overlay-outer-wrapper] > .overlays__backdrop--animation-in {
      animation: wk-backdrop-fade-in 300ms;
      opacity: 0.18;
    }
    dialog[data-overlay-outer-wrapper] > .overlays__backdrop--animation-out {
      animation: wk-backdrop-fade-out 300ms;
      opacity: 0;
    }
    @keyframes wk-backdrop-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 0.18;
      }
    }
    @keyframes wk-backdrop-fade-out {
      from {
        opacity: 0.18;
      }
      to {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      dialog[data-overlay-outer-wrapper] > .overlays__backdrop--animation-in,
      dialog[data-overlay-outer-wrapper] > .overlays__backdrop--animation-out {
        animation-duration: 1ms;
      }
    }
  `;

  #contentRoot?: HTMLElement;
  #originObserver?: MutationObserver;
  #contentObserver?: MutationObserver;
  #systemMode?: MediaQueryList;
  #savedAttributes = new Map<string, string | null>();
  #savedTokenStyles = new Map<string, SavedInlineStyle>();
  #active = false;
  #closing = false;
  #restoreFocus = false;
  #focusWasInside = false;
  #focusMovedOutside = false;
  #restoreTarget?: HTMLElement;
  #closeInFlight?: Promise<void>;
  #invokerAncestors: HTMLElement[] = [];

  constructor() {
    super();
    this.addEventListener('before-opened', this.#onBeforeOpened);
    this.addEventListener('before-closed', this.#onBeforeClosed);
  }

  protected override _defineOverlayConfig(): OverlayConfig & { isAlertDialog: boolean } {
    return {
      ...super._defineOverlayConfig(),
      hasBackdrop: true,
      preventsScroll: true,
      trapsKeyboardFocus: true,
      hidesOnEsc: true,
      hidesOnOutsideClick: false,
      handlesAccessibility: true,
      // Wakata restores focus after checking the current application focus.
      elementToFocusAfterHide: undefined,
    };
  }

  override async open(): Promise<void> {
    await this.#waitForSetup();
    const root = this.#resolveContentRoot();
    const problem = this.#contentProblem(root);
    if (!root || problem) throw new Error(problem ?? 'wk-dialog has no content root.');
    this.#beginOpen(root);
    await super.open();
    this.#focusWasInside = this.#hasFocusInContent();
  }

  override close(): Promise<void> {
    if (this.#closeInFlight) return this.#closeInFlight;
    const closeTask = (async (): Promise<void> => {
      await this.#waitForSetup();
      await super.close();
      if (!this.opened) this.#finishClose();
    })();
    this.#closeInFlight = closeTask;
    const clearTask = (): void => {
      if (this.#closeInFlight === closeTask) this.#closeInFlight = undefined;
    };
    void closeTask.then(clearTask, clearTask);
    return closeTask;
  }

  override firstUpdated(): void {
    this.renderRoot.addEventListener('slotchange', this.#onSlotChange);
  }

  override requestUpdate(
    name?: PropertyKey,
    oldValue?: unknown,
    options?: PropertyDeclaration,
  ): void {
    super.requestUpdate(name, oldValue, options);
    if (name === 'opened' && this.opened === false) {
      queueMicrotask(() => this.#finishClose());
    }
  }

  #waitForSetup = async (): Promise<void> => {
    if (!this.isConnected)
      throw new Error('wk-dialog must be connected before opening or closing.');
    await this.updateComplete;
    await new Promise<void>((resolve) => queueMicrotask(resolve));
  };

  #resolveContentRoot = (): HTMLElement | undefined => {
    const assigned = this.renderRoot
      .querySelector<HTMLSlotElement>('slot[name="content"]')
      ?.assignedElements({ flatten: true })[0];
    if (assigned instanceof HTMLElement) {
      this.#contentRoot = assigned;
      return assigned;
    }
    if (this.#contentRoot?.isConnected) return this.#contentRoot;
    const lightDomContent = Array.from(this.children).find(
      (child): child is HTMLElement => child instanceof HTMLElement && child.slot === 'content',
    );
    if (lightDomContent) this.#contentRoot = lightDomContent;
    return lightDomContent;
  };

  #contentProblem = (root?: HTMLElement): string | undefined => {
    if (!root) return 'wk-dialog requires one element in slot="content".';
    const labelIds =
      root.getAttribute('aria-labelledby')?.trim().split(/\s+/).filter(Boolean) ?? [];
    const labelText = labelIds
      .map((id) => this.#referencedText(root, id))
      .filter((text): text is string => Boolean(text))
      .join(' ')
      .trim();
    if (!labelText && !root.getAttribute('aria-label')?.trim()) {
      return 'wk-dialog content requires an accessible title via aria-labelledby or aria-label.';
    }
    const descriptionIds = root
      .getAttribute('aria-describedby')
      ?.trim()
      .split(/\s+/)
      .filter(Boolean);
    if (descriptionIds?.some((id) => !this.#referencedText(root, id))) {
      return 'wk-dialog aria-describedby must reference content inside the dialog content root.';
    }
    return undefined;
  };

  #referencedText = (root: HTMLElement, id: string): string | undefined =>
    [...root.querySelectorAll<HTMLElement>('[id]')]
      .find((element) => element.id === id)
      ?.textContent?.trim();

  #onBeforeOpened = (event: Event): void => {
    const root = this.#resolveContentRoot();
    const problem = this.#contentProblem(root);
    if (problem) {
      event.preventDefault();
      console.error(new Error(problem));
      return;
    }
    this.#beginOpen(root!);
  };

  #beginOpen = (root: HTMLElement): void => {
    if (this.#active) return;
    this.#contentRoot = root;
    this.#savedAttributes = new Map(
      [...scopedAttributes, 'data-wk-dialog-content', 'aria-modal'].map((name) => [
        name,
        root.getAttribute(name),
      ]),
    );
    this.#savedTokenStyles = new Map(
      tokenNames.map((name) => [
        name,
        {
          value: root.style.getPropertyValue(name),
          priority: root.style.getPropertyPriority(name),
        },
      ]),
    );
    this.#invokerAncestors = this.#getInvokerAncestors();
    this.#active = true;
    this.#closing = false;
    this.#restoreFocus = false;
    this.#focusWasInside = root.contains(document.activeElement);
    this.#focusMovedOutside = false;
    root.setAttribute('data-wk-dialog-content', '');
    root.setAttribute('aria-modal', 'true');
    document.addEventListener('focusin', this.#onDocumentFocusIn, true);
    this.#refreshOrigin();
    this.#observeOrigin();
    this.#observeContent();
    this.#systemMode = window.matchMedia('(prefers-color-scheme: dark)');
    this.#systemMode.addEventListener('change', this.#refreshOrigin);
  };

  #refreshOrigin = (): void => {
    const root = this.#contentRoot;
    if (!root) return;
    for (const name of scopedAttributes) {
      const value = this.#getEffectiveAttribute(name);
      if (value === null) root.removeAttribute(name);
      else root.setAttribute(name, value);
    }
    const computed = getComputedStyle(this);
    for (const name of tokenNames) {
      const value = computed.getPropertyValue(name).trim();
      if (value) root.style.setProperty(name, value);
      else root.style.removeProperty(name);
    }
  };

  #getEffectiveAttribute = (name: (typeof scopedAttributes)[number]): string | null => {
    if (this.hasAttribute(name)) return this.getAttribute(name);
    const root = this.getRootNode();
    let element = this.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
    while (element) {
      if (element.hasAttribute(name)) return element.getAttribute(name);
      const tree = element.getRootNode();
      element = element.parentElement ?? (tree instanceof ShadowRoot ? tree.host : null);
    }
    return null;
  };

  #observeOrigin = (): void => {
    this.#originObserver = new MutationObserver(this.#refreshOrigin);
    const observe = (element: Element): void => {
      this.#originObserver?.observe(element, {
        attributes: true,
        attributeFilter: observedAttributes,
      });
    };
    observe(this);
    const root = this.getRootNode();
    let element: Element | null =
      this.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
    while (element) {
      observe(element);
      const tree = element.getRootNode();
      element = element.parentElement ?? (tree instanceof ShadowRoot ? tree.host : null);
    }
  };

  #observeContent = (): void => {
    this.#contentObserver = new MutationObserver(() => {
      if (this.#active && this.#contentRoot && !this.#contentRoot.isConnected) {
        void this.close();
      }
    });
    this.#contentObserver.observe(document.documentElement, { childList: true, subtree: true });
  };

  #onDocumentFocusIn = (event: FocusEvent): void => {
    if (!this.#active) return;
    const root = this.#contentRoot;
    const inside = Boolean(
      root &&
      event
        .composedPath()
        .some((target) => target === root || (target instanceof Node && root.contains(target))),
    );
    const target = event.target;
    if (this.#closing) {
      if (
        !inside &&
        target !== this.#getInvoker() &&
        target !== document.body &&
        target !== document.documentElement
      ) {
        this.#focusMovedOutside = true;
      }
      return;
    }
    this.#focusWasInside = inside;
  };

  #onBeforeClosed = (): void => {
    this.#restoreFocus = this.#focusWasInside || this.#hasFocusInContent();
    this.#closing = true;
    this.#restoreTarget = this.#restoreFocus ? this.#getInvoker() : undefined;
  };

  #hasFocusInContent = (): boolean => {
    const root = this.#contentRoot;
    if (!root) return false;
    if (root.contains(document.activeElement)) return true;
    const tree = root.getRootNode();
    return (
      tree instanceof ShadowRoot && Boolean(tree.activeElement && root.contains(tree.activeElement))
    );
  };

  #finishClose = (): void => {
    if (!this.#active || this.opened) return;
    if (!this.#focusMovedOutside && this.#restoreFocus) {
      const target =
        (this.#restoreTarget && this.#isFocusable(this.#restoreTarget) && this.#restoreTarget) ||
        this.#getInvoker() ||
        this.#invokerAncestors.find((item) => this.#isFocusable(item));
      if (target) {
        if (document.activeElement !== target) target.focus();
      } else {
        this.#focusMainOrBody();
      }
    }
    this.#restoreOriginStyles();
    this.#originObserver?.disconnect();
    this.#contentObserver?.disconnect();
    this.#systemMode?.removeEventListener('change', this.#refreshOrigin);
    document.removeEventListener('focusin', this.#onDocumentFocusIn, true);
    this.#originObserver = undefined;
    this.#contentObserver = undefined;
    this.#systemMode = undefined;
    this.#savedAttributes.clear();
    this.#savedTokenStyles.clear();
    this.#invokerAncestors = [];
    this.#restoreTarget = undefined;
    this.#active = false;
    this.#closing = false;
    this.#restoreFocus = false;
  };

  #restoreOriginStyles = (): void => {
    const root = this.#contentRoot;
    if (!root) return;
    for (const [name, value] of this.#savedAttributes) {
      if (value === null) root.removeAttribute(name);
      else root.setAttribute(name, value);
    }
    for (const [name, { value, priority }] of this.#savedTokenStyles) {
      if (value) root.style.setProperty(name, value, priority);
      else root.style.removeProperty(name);
    }
  };

  #onSlotChange = (): void => {
    const replacement = this.renderRoot
      .querySelector<HTMLSlotElement>('slot[name="content"]')
      ?.assignedElements({ flatten: true })[0];
    if (this.#active && replacement instanceof HTMLElement && replacement !== this.#contentRoot) {
      void this.close();
    } else if (!this.#active) {
      this.#contentRoot = replacement instanceof HTMLElement ? replacement : undefined;
    }
  };

  #getInvoker = (): HTMLElement | undefined => {
    const slotted = Array.from(this.children).find((child) => child.slot === 'invoker');
    if (!(slotted instanceof HTMLElement)) return undefined;
    if (this.#isFocusable(slotted)) return slotted;
    const descendant = slotted.querySelector<HTMLElement>(focusableSelector);
    return descendant && this.#isFocusable(descendant) ? descendant : undefined;
  };

  #getInvokerAncestors = (): HTMLElement[] => {
    const ancestors: HTMLElement[] = [];
    let element: Element | null = this.#getInvoker()?.parentElement ?? this.parentElement;
    while (element) {
      if (element instanceof HTMLElement) ancestors.push(element);
      const tree = element.getRootNode();
      element = element.parentElement ?? (tree instanceof ShadowRoot ? tree.host : null);
    }
    return ancestors;
  };

  #isFocusable = (element: HTMLElement): boolean => {
    if (
      !element.isConnected ||
      element.matches(':disabled') ||
      element.closest('[hidden], [inert]') ||
      element.getAttribute('aria-hidden') === 'true' ||
      element.getAttribute('aria-disabled') === 'true'
    ) {
      return false;
    }
    return (
      element.matches(focusableSelector) &&
      element.tabIndex >= -1 &&
      getComputedStyle(element).display !== 'none' &&
      getComputedStyle(element).visibility !== 'hidden' &&
      getComputedStyle(element).opacity !== '0' &&
      element.getClientRects().length > 0
    );
  };

  #focusMainOrBody = (): void => {
    const target = document.querySelector<HTMLElement>('main') ?? document.body;
    if (!target) return;
    const oldTabIndex = target.getAttribute('tabindex');
    if (oldTabIndex === null) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener(
        'blur',
        () => {
          target.removeAttribute('tabindex');
        },
        { once: true },
      );
    }
    target.focus();
  };
}
