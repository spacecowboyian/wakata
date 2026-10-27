// Synthetic request/review fixture logic. No network, storage or business action.
// Expects the markup in request-review.html and registered @wakata/ds elements.
export function initRequestReview(root, { completionMs = 600 } = {}) {
  const $ = (id) => root.querySelector(`#${id}`);
  const wrapper = root.querySelector('wk-form');
  const form = root.querySelector('form');
  const name = $('rr-name');
  const destination = $('rr-destination');
  const submit = $('rr-submit');
  const status = $('rr-status');
  const dialog = root.querySelector('wk-dialog');
  const reopen = $('rr-reopen');
  const cancel = $('rr-cancel');
  const confirm = $('rr-confirm');
  const summary = $('rr-summary');
  const stats = { attempts: 0, blocked: 0, completions: 0 };
  let processing = false;
  let reviewReady = false;

  const say = (text) => {
    status.textContent = text;
  };
  const clearCorrection = () => {
    if (status.textContent.startsWith('Please correct')) say('');
  };
  name.addEventListener('wk-input', clearCorrection);
  destination.addEventListener('wk-input', clearCorrection);
  // Native constraint validation (form has novalidate) plus Lion validation state.
  const invalidNative = () => [...form.elements].find((el) => !el.checkValidity?.());
  const hasLionErrors = () =>
    wrapper.hasFeedbackFor.includes('error') || [name, destination].some((f) => f.error);
  let validating = false;

  wrapper.addEventListener('submit', async () => {
    stats.attempts += 1;
    if (processing || validating || dialog.opened) {
      stats.blocked += 1;
      say('Request already in progress.');
      return;
    }
    validating = true;
    try {
      await Promise.all([name, destination].map((f) => f.updateComplete));
    } finally {
      validating = false;
    }
    const bad = invalidNative();
    if (bad || hasLionErrors() || [name, destination].some((f) => f.isPending)) {
      stats.blocked += 1;
      say('Please correct the highlighted fields before review.');
      return;
    }
    reviewReady = true;
    reopen.disabled = false;
    summary.textContent = `${name.value} → ${destination.value}`;
    say('Ready for review.');
    await dialog.open();
  });

  reopen.addEventListener('click', () => {
    if (!processing) summary.textContent = `${name.value} → ${destination.value}`;
  });

  cancel.addEventListener('click', async () => {
    if (processing) return;
    say('Review cancelled. Nothing was submitted.');
    await dialog.close();
  });

  confirm.addEventListener('click', async () => {
    if (processing) return;
    processing = true;
    confirm.loading = true;
    cancel.disabled = true;
    submit.disabled = true;
    say('Completing mock request…');
    await new Promise((resolve) => setTimeout(resolve, completionMs));
    stats.completions += 1;
    processing = false;
    confirm.loading = false;
    cancel.disabled = false;
    submit.disabled = false;
    say('Mock request complete. No real action was taken.');
    await dialog.close();
  });

  form.addEventListener('reset', () => {
    if (processing) return;
    reviewReady = false;
    reopen.disabled = true;
    say('');
  });

  reopen.disabled = !reviewReady;
  return { stats, isProcessing: () => processing };
}
