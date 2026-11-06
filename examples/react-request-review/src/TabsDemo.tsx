import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '@wakata/ds/themes.css';
import '@wakata/ds/tabs/define';
import type { WkTabs } from '@wakata/ds/tabs';

/** Synthetic controlled Tabs example; it does not submit a form. */
export function TabsDemo() {
  const [selected, setSelected] = useState('body');
  const tabsRef = useRef<WkTabs>(null);

  useEffect(() => {
    const tabs = tabsRef.current!;
    const onChange = (event: Event) => {
      setSelected((event as CustomEvent<{ value: string }>).detail.value);
    };
    tabs.addEventListener('wk-change', onChange);
    return () => tabs.removeEventListener('wk-change', onChange);
  }, []);

  useLayoutEffect(() => {
    const tabs = tabsRef.current!;
    if (tabs.value !== selected) tabs.value = selected;
  }, [selected]);

  return (
    <main data-wk-theme="neutral" data-wk-mode="light">
      <h1>Vintage car checklist</h1>
      <p>Arrow keys move focus; Enter or Space opens a panel.</p>
      <wk-tabs ref={tabsRef} label="Checklist sections">
        <wk-tab slot="tab" value="body">
          Body
        </wk-tab>
        <wk-tab slot="tab" value="mechanical">
          Mechanical
        </wk-tab>
        <wk-tab slot="tab" value="records">
          Records
        </wk-tab>
        <wk-tab-panel slot="panel" value="body">
          Inspect corrosion and paint repairs.
        </wk-tab-panel>
        <wk-tab-panel slot="panel" value="mechanical">
          Check leaks, braking and steering.
        </wk-tab-panel>
        <wk-tab-panel slot="panel" value="records">
          Compare service and ownership records.
        </wk-tab-panel>
      </wk-tabs>
      <button type="button" onClick={() => setSelected('records')}>
        Choose Records programmatically
      </button>
      <output aria-live="polite">Selected: {selected}</output>
    </main>
  );
}
