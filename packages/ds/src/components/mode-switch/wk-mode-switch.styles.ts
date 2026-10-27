import { css } from 'lit';

export const wkModeSwitchStyles = css`
  :host {
    display: block;
    color: var(--wk-text, #222);
    font-family: var(--wk-font, system-ui, sans-serif);
  }

  fieldset {
    min-inline-size: 0;
    margin: 0;
    padding: 8px 12px 12px;
    border: 1px solid var(--wk-border, #999);
    border-radius: var(--wk-radius, 0);
    background: var(--wk-surface, #fff);
  }

  legend {
    padding-inline: 4px;
  }

  .choices {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
  }

  label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    cursor: pointer;
  }

  input {
    margin: 0;
    accent-color: var(--wk-accent, #171717);
  }

  input:focus-visible {
    outline: 2px solid var(--wk-focus, #111);
    outline-offset: 3px;
  }
`;
