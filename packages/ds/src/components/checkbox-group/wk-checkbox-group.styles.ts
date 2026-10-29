import { css } from 'lit';

export const wkCheckboxGroupStyles = css`
  :host {
    display: block;
    min-width: 0;
    max-width: 100%;
    color: var(--wk-text, #222);
    font-family: var(--wk-font, Arial, Helvetica, sans-serif);
  }
  .form-field__group-one,
  .form-field__group-two {
    min-width: 0;
  }
  .form-field__label {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    overflow-wrap: anywhere;
  }
  .form-field__help-text,
  .form-field__feedback,
  .form-field__after {
    display: block;
    margin-block-start: 4px;
    font-size: 13px;
    line-height: 18px;
    overflow-wrap: anywhere;
  }
  .input-group {
    display: grid;
    gap: 4px;
    margin-block-start: 8px;
  }
  ::slotted([data-wk-external-error]),
  :host([shows-feedback-for~='error']) .form-field__feedback {
    color: var(--wk-danger, #a02222);
  }
  :host([disabled]) {
    color: var(--wk-disabled-text, #777);
  }
`;
