import { css } from 'lit';

/** Wakata overrides layered on top of LionButton's functional styles. Values come from --wk-* tokens. */
export const wkButtonStyles = css`
  :host {
    --_bg: var(--wk-surface, #fff);
    --_fg: var(--wk-text, #222);
    --_border: var(--wk-border, #999);
    justify-content: center;
    min-height: 44px;
    padding: 9px 18px;
    border: 1px solid var(--_border);
    border-radius: var(--wk-radius, 0px);
    background: var(--_bg);
    color: var(--_fg);
    font-family: var(--wk-font, Arial, Helvetica, sans-serif);
    font-size: 14px;
    line-height: 24px;
    cursor: pointer;
    transition:
      background 0.12s,
      transform 0.08s;
  }
  :host([variant='primary']) {
    --_bg: var(--wk-accent, #171717);
    --_fg: var(--wk-on-accent, #fff);
    --_border: var(--wk-accent, #171717);
  }
  :host([variant='tertiary']) {
    --_bg: transparent;
    --_border: transparent;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  :host([intent='danger']) {
    --_fg: var(--wk-danger, #a02222);
    --_border: var(--wk-danger, #a02222);
  }
  :host([variant='primary'][intent='danger']) {
    --_bg: var(--wk-danger, #a02222);
    --_fg: var(--wk-on-danger, #fff);
  }
  :host(:hover) {
    background: color-mix(in srgb, var(--_bg) 90%, var(--wk-text, #222) 10%);
  }
  :host([variant='primary']:hover),
  :host([variant='primary'][intent='danger']:hover) {
    background: color-mix(in srgb, var(--_bg) 86%, var(--wk-hover-mix, #000) 14%);
  }
  :host(:active),
  :host([active]) {
    background: color-mix(in srgb, var(--_bg) 80%, var(--wk-text, #222) 20%);
    transform: translateY(1px);
  }
  :host([size='small']) {
    font-size: 12px;
    min-height: 36px;
    padding: 5px 12px;
  }
  :host([size='large']) {
    min-height: 52px;
    padding: 13px 22px;
  }
  :host(:focus:not([disabled])),
  :host(:focus-visible) {
    outline: 2px solid var(--wk-focus, #111);
    outline-offset: 4px;
  }
  :host(:focus:not(:focus-visible)) {
    outline: 0;
  }
  :host([disabled]) {
    background: var(--wk-disabled-bg, #eee);
    color: var(--wk-disabled-text, #777);
    border-color: var(--wk-disabled-border, #ddd);
    cursor: not-allowed;
    transform: none;
  }
  :host([loading]) {
    cursor: progress;
    transform: none;
  }
  :host([loading])::after {
    content: '';
    position: absolute;
    right: 4px;
    top: 4px;
    width: 6px;
    height: 6px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: wk-button-spin 0.7s linear infinite;
  }
  @keyframes wk-button-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    :host {
      transition: none;
    }
    :host([loading])::after {
      animation: none;
    }
  }
  @media (forced-colors: active) {
    :host {
      border-color: ButtonText;
    }
    :host(:focus-visible) {
      outline-color: Highlight;
    }
    :host([disabled]) {
      color: GrayText;
      border-color: GrayText;
    }
  }
`;
