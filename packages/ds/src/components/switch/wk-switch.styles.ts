import { css } from 'lit';

export const wkSwitchStyles = css`
  :host {
    display: block;
    min-width: 0;
    max-width: 100%;
    color: var(--wk-text, #222);
    font-family: var(--wk-font, Arial, Helvetica, sans-serif);
  }
  .form-field__label,
  label {
    display: block;
    box-sizing: border-box;
    min-height: 44px;
    padding-block: 12px;
    font-size: 14px;
    line-height: 20px;
    overflow-wrap: anywhere;
    cursor: pointer;
  }
  .form-field__help-text,
  .form-field__feedback {
    display: block;
    font-size: 13px;
    line-height: 18px;
    overflow-wrap: anywhere;
  }
  .input-group__container {
    display: flex;
    align-items: center;
    min-height: 44px;
  }
  ::slotted([data-tag-name='lion-switch-button']) {
    min-height: 44px;
  }
  :host([disabled]) {
    color: var(--wk-disabled-text, #777);
  }
  :host([disabled]) ::slotted([data-tag-name='lion-switch-button']) {
    border-color: var(--wk-disabled-border, #ddd);
  }
`;
