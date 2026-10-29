import { css } from 'lit';

export const wkTextAreaStyles = css`
  :host {
    display: block;
    min-width: 0;
    max-width: 100%;
    color: var(--wk-text, #222);
    font-family: var(--wk-font, Arial, Helvetica, sans-serif);
  }
  .form-field__label {
    margin-block-end: 4px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
  }
  .form-field__help-text,
  .form-field__feedback,
  .input-group__after {
    display: block;
    margin-block-start: 4px;
    color: var(--wk-text, #222);
    font-size: 13px;
    line-height: 18px;
    overflow-wrap: anywhere;
  }
  .input-group__container {
    min-height: 44px;
    border: 1px solid var(--wk-border, #999);
    border-radius: var(--wk-radius, 0px);
    background: var(--wk-surface, #fff);
  }
  .input-group__input {
    min-width: 0;
  }
  ::slotted(textarea[slot='input']) {
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 44px;
    padding: 10px 12px;
    border: 0;
    border-radius: inherit;
    outline: 0;
    background: transparent;
    color: var(--wk-text, #222);
    font: inherit;
    line-height: 24px;
    overflow-wrap: anywhere;
    resize: none;
  }
  ::slotted(textarea[slot='input']:focus-visible) {
    outline: 2px solid var(--wk-focus, #111);
    outline-offset: 2px;
  }
  :host(:has(> textarea[slot='input'][aria-invalid='true'])) .input-group__container {
    border-color: var(--wk-danger, #a02222);
  }
  ::slotted([data-wk-external-error]) {
    color: var(--wk-danger, #a02222);
  }
  :host([disabled]) .input-group__container {
    border-color: var(--wk-disabled-border, #ddd);
    background: var(--wk-disabled-bg, #eee);
  }
  :host([disabled]) ::slotted(textarea[slot='input']) {
    color: var(--wk-disabled-text, #777);
    cursor: not-allowed;
  }
  :host([readonly]) .input-group__container {
    background: color-mix(in srgb, var(--wk-surface, #fff) 88%, var(--wk-text, #222) 12%);
  }
  :host([shows-feedback-for~='error']) .form-field__feedback {
    color: var(--wk-danger, #a02222);
  }
  @media (prefers-reduced-motion: reduce) {
    :host,
    .input-group__container {
      transition: none;
    }
  }
  @media (forced-colors: active) {
    .input-group__container {
      border-color: CanvasText;
    }
    ::slotted(textarea[slot='input']:focus-visible) {
      outline-color: Highlight;
    }
  }
`;
