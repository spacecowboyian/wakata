import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import '@wakata/ds/themes.css';
import '@wakata/ds/define';
import '@wakata/ds/mode-switch/define';
import type { WkTextField } from '@wakata/ds/text-field';
import '@wakata/ds/text-area/define';
import type { WkTextArea } from '@wakata/ds/text-area';
import type { WkSelect } from '@wakata/ds/select';
import type { WkRadioGroup } from '@wakata/ds/radio-group';
import type { WkDialog } from '@wakata/ds/dialog';

// Adapter: React does not subscribe to custom events; bridge `wk-input` into controlled state.
// Programmatic `.value` writes never emit wk-input, so setting the property cannot loop.
function useWkField<T extends HTMLElement & { value: string }>(
  value: string,
  onValue: (v: string) => void,
  externalValue?: string,
) {
  const ref = useRef<T>(null);
  const handler = useRef(onValue);
  const lastInput = useRef<string | null>(null);
  const lastExternal = useRef(externalValue);
  handler.current = onValue;
  useEffect(() => {
    const el = ref.current!;
    const on = (e: Event) => {
      const next = (e as CustomEvent<{ value: string }>).detail.value;
      lastInput.current = next;
      handler.current(next);
    };
    el.addEventListener('wk-input', on);
    return () => el.removeEventListener('wk-input', on);
  }, []);
  useLayoutEffect(() => {
    const el = ref.current!;
    if (lastExternal.current !== externalValue) {
      lastExternal.current = externalValue;
      lastInput.current = null;
      if (externalValue !== undefined && el.value !== externalValue) el.value = externalValue;
      return;
    }
    // React may commit an older keystroke after the native input has moved on.
    // Never echo that stale state back over the latest user value.
    if (lastInput.current !== null && value !== lastInput.current) return;
    if (el.value !== value) el.value = value;
    lastInput.current = null;
  }, [value, externalValue]);
  return ref;
}

const CHANNELS = [
  ['email', 'Email'],
  ['sms', 'Text message'],
] as const;

// Boolean controls report `{ checked }` via wk-input; programmatic `.checked` writes emit nothing.
function useWkBoolean(checked: boolean, onChecked: (v: boolean) => void) {
  const ref = useRef<HTMLElement & { checked: boolean }>(null);
  const handler = useRef(onChecked);
  handler.current = onChecked;
  useEffect(() => {
    const el = ref.current!;
    const on = (e: Event) =>
      handler.current((e as CustomEvent<{ checked: boolean }>).detail.checked);
    el.addEventListener('wk-input', on);
    return () => el.removeEventListener('wk-input', on);
  }, []);
  useLayoutEffect(() => {
    const el = ref.current!;
    if (el.checked !== checked) el.checked = checked;
  }, [checked]);
  return ref;
}

export interface RequestReviewProps {
  completionMs?: number;
  onComplete?: (data: { traveller: string; destination: string; notes: string }) => void;
  externalError?: string;
  nameDisabled?: boolean;
  nameReadonly?: boolean;
  /** Parent-driven values; when defined they replace the field state (controlled use). */
  traveller?: string;
  destinationValue?: string;
  notesValue?: string;
}

export function RequestReview({
  completionMs = 600,
  onComplete,
  externalError = '',
  nameDisabled = false,
  nameReadonly = false,
  traveller,
  destinationValue,
  notesValue,
}: RequestReviewProps) {
  const [name, setName] = useState(traveller ?? '');
  const [destination, setDestination] = useState(destinationValue ?? '');
  useEffect(() => {
    if (traveller !== undefined) setName(traveller);
  }, [traveller]);
  useEffect(() => {
    if (destinationValue !== undefined) setDestination(destinationValue);
  }, [destinationValue]);
  const [notes, setNotes] = useState(notesValue ?? '');
  useEffect(() => {
    if (notesValue !== undefined) setNotes(notesValue);
  }, [notesValue]);
  const [channels, setChannels] = useState<string[]>([]);
  const [priority, setPriority] = useState('');
  const [compact, setCompact] = useState(false);
  const toggle = (key: string) => (on: boolean) =>
    setChannels((c) => (on ? [...new Set([...c, key])] : c.filter((k) => k !== key)));
  const emailRef = useWkBoolean(channels.includes('email'), toggle('email'));
  const smsRef = useWkBoolean(channels.includes('sms'), toggle('sms'));
  const compactRef = useWkBoolean(compact, setCompact);
  const groupRef = useRef<HTMLElement & { updateComplete: Promise<unknown>; error?: string }>(null);
  const [status, setStatus] = useState('');
  useEffect(() => {
    setStatus((current) => (current.startsWith('Please correct') ? '' : current));
  }, [name, destination, notes, channels]);
  const [reviewReady, setReviewReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const busy = useRef(false);
  const validating = useRef(false);
  const nameRef = useWkField<WkTextField>(name, setName, traveller);
  const destRef = useWkField<WkSelect>(destination, setDestination, destinationValue);
  const notesRef = useWkField<WkTextArea>(notes, setNotes, notesValue);
  const priorityRef = useWkField<WkRadioGroup>(priority, setPriority);
  const dialogRef = useRef<WkDialog>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const wrapperRef = useRef<HTMLElement & { hasFeedbackFor: string[] }>(null);

  useEffect(() => {
    if (nameRef.current) nameRef.current.error = externalError;
  }, [externalError, nameRef]);
  useEffect(() => {
    const el = nameRef.current as unknown as { readOnly?: boolean; readonly?: boolean };
    el.readOnly = nameReadonly;
    el.readonly = nameReadonly;
  }, [nameReadonly, nameRef]);

  // wk-form emits `submit` after Lion validation; native form has novalidate.
  useEffect(() => {
    const wrapper = wrapperRef.current!;
    const onSubmit = async () => {
      const dialog = dialogRef.current!;
      if (busy.current || validating.current || dialog.opened) {
        setStatus('Request already in progress.');
        return;
      }
      validating.current = true;
      try {
        await Promise.all(
          [nameRef.current, destRef.current, notesRef.current, groupRef.current].map(
            (f) => f?.updateComplete,
          ),
        );
      } finally {
        validating.current = false;
      }
      const form = formRef.current!;
      const bad = [...form.elements].find((el) => !(el as HTMLInputElement).checkValidity?.());
      const fields = [nameRef.current!, destRef.current!, notesRef.current!];
      if (
        bad ||
        channels.length === 0 ||
        groupRef.current?.error ||
        wrapper.hasFeedbackFor.includes('error') ||
        fields.some((f) => f.error || f.isPending)
      ) {
        setStatus('Please correct the highlighted fields before review.');
        return;
      }
      setReviewReady(true);
      setStatus('Ready for review.');
      await dialog.open();
    };
    wrapper.addEventListener('submit', onSubmit);
    return () => wrapper.removeEventListener('submit', onSubmit);
  }, [nameRef, destRef, notesRef, groupRef, channels]);

  const confirm = async () => {
    if (busy.current) return;
    busy.current = true;
    setProcessing(true);
    setStatus('Completing mock request…');
    await new Promise((r) => setTimeout(r, completionMs));
    busy.current = false;
    setProcessing(false);
    onComplete?.({ traveller: name, destination, notes });
    setStatus('Mock request complete. No real action was taken.');
    await dialogRef.current!.close();
  };
  const cancel = async () => {
    if (busy.current) return;
    setStatus('Review cancelled. Nothing was submitted.');
    await dialogRef.current!.close();
  };
  const onReset = (e: FormEvent) => {
    if (busy.current) return e.preventDefault();
    setName('');
    setDestination('');
    setNotes('');
    setChannels([]);
    setPriority('');
    setReviewReady(false);
    setStatus('');
  };

  return (
    <main>
      <wk-mode-switch></wk-mode-switch>
      <wk-card>
        <h1 slot="heading">Synthetic travel request</h1>
        <wk-form ref={wrapperRef}>
          <form ref={formRef} noValidate onReset={onReset}>
            <wk-text-field
              id="rr-name"
              ref={nameRef}
              name="traveller"
              label="Traveller name"
              help-text="Synthetic name only."
              required
              disabled={nameDisabled || undefined}
            ></wk-text-field>
            <wk-select
              id="rr-destination"
              ref={destRef}
              name="destination"
              label="Destination"
              required
            >
              <select slot="input">
                <option value="">Choose a destination</option>
                <option value="oslo">Oslo</option>
                <option value="bergen">Bergen</option>
              </select>
            </wk-select>
            <wk-text-area
              id="rr-notes"
              ref={notesRef}
              name="notes"
              label="Notes (optional)"
              help-text="Synthetic notes only."
            ></wk-text-area>
            <wk-checkbox-group
              id="rr-channels"
              ref={groupRef}
              name="channels[]"
              label="Contact channels"
              required
            >
              {CHANNELS.map(([value, label]) => (
                <wk-checkbox
                  key={value}
                  id={`rr-channel-${value}`}
                  ref={value === 'email' ? emailRef : smsRef}
                  name="channels[]"
                  label={label}
                  choiceValue={value}
                ></wk-checkbox>
              ))}
            </wk-checkbox-group>
            <wk-radio-group
              id="rr-priority"
              ref={priorityRef}
              name="priority"
              label="Inspection priority (optional)"
              help-text="Choose the first area to inspect."
            >
              <wk-radio label="Bodywork" choiceValue="body"></wk-radio>
              <wk-radio label="Engine" choiceValue="engine"></wk-radio>
            </wk-radio-group>
            <div className="actions">
              <wk-button-submit id="rr-submit" variant="primary" disabled={processing || undefined}>
                Review request
              </wk-button-submit>
              <wk-button-reset>Reset</wk-button-reset>
            </div>
            <output id="rr-status" aria-live="polite">
              {status}
            </output>
          </form>
        </wk-form>
        <wk-switch
          id="rr-compact"
          ref={compactRef}
          name="compact"
          label="Compact summary"
        ></wk-switch>
        <div slot="actions">
          <div id="rr-scope" data-wk-theme="studio">
            <wk-dialog ref={dialogRef}>
              <wk-button id="rr-reopen" slot="invoker" disabled={!reviewReady || undefined}>
                Reopen review
              </wk-button>
              <section slot="content" aria-labelledby="rr-title" aria-describedby="rr-desc">
                <h2 id="rr-title">Review request</h2>
                <p id="rr-desc">
                  Mock only:{' '}
                  <span id="rr-summary">{`${name} → ${destination}${priority ? ` · ${priority} inspection first` : ''}`}</span>
                  . Nothing is sent.
                </p>
                {notes ? (
                  <p id="rr-notes-summary" style={{ whiteSpace: 'pre-wrap' }}>
                    {notes}
                  </p>
                ) : null}
                <div className="actions">
                  <wk-button id="rr-cancel" disabled={processing || undefined} onClick={cancel}>
                    Cancel
                  </wk-button>
                  <wk-button
                    id="rr-confirm"
                    variant="primary"
                    loading={processing || undefined}
                    onClick={confirm}
                  >
                    Confirm
                  </wk-button>
                </div>
              </section>
            </wk-dialog>
          </div>
        </div>
      </wk-card>
    </main>
  );
}
