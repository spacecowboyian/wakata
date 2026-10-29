/** Detail of `wk-input` and `wk-change` on boolean controls (checkbox, switch). */
export interface WkBooleanEventDetail {
  checked: boolean;
  name: string;
  /** Submitted choice value for Checkbox; Switch has no form value. */
  value?: string;
}
