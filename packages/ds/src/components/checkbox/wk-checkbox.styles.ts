import { css } from 'lit';

export const wkCheckboxStyles = css`
  :host {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr);
    min-width: 0;
    max-width: 100%;
    color: var(--wk-text, #222);
    font-family: var(--wk-font, Arial, Helvetica, sans-serif);
  }
  slot[name='input'] {
    grid-column: 1;
    grid-row: 1;
    display: block;
    min-width: 0;
    min-height: 44px;
  }
  ::slotted(input[slot='input']) {
    flex: none;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    margin: 10px;
    accent-color: var(--wk-text, #222);
  }
  ::slotted(input[slot='input']:focus-visible) {
    outline: 2px solid var(--wk-focus, #111);
    outline-offset: 2px;
  }
  .choice-field__label {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: center;
    min-height: 44px;
    font-size: 14px;
    line-height: 20px;
    overflow-wrap: anywhere;
    cursor: pointer;
  }
  .choice-field__help-text,
  .choice-field__after {
    grid-column: 2;
    display: block;
    min-width: 0;
    font-size: 13px;
    line-height: 18px;
    overflow-wrap: anywhere;
  }
  .choice-field__help-text:empty,
  .choice-field__after:empty {
    display: none;
  }
  ::slotted([data-wk-external-error]) {
    color: var(--wk-danger, #a02222);
  }
  :host([shows-feedback-for~='error']) .form-field__feedback {
    color: var(--wk-danger, #a02222);
  }
  :host([disabled]) {
    color: var(--wk-disabled-text, #777);
  }
  :host([disabled]) ::slotted(input[slot='input']),
  :host([disabled]) .choice-field__label {
    cursor: not-allowed;
  }
  @media (forced-colors: active) {
    ::slotted(input[slot='input']:focus-visible) {
      outline-color: Highlight;
    }
  }
`;
