// Contact form: submits to the form service in the form's action (Web3Forms by default)
// and only reports success when the service confirms delivery.
const form = document.querySelector('[data-contact-form]');

if (form) {
  const status = form.querySelector('[data-form-status]');
  const submitButton = form.querySelector('button[type="submit"]');
  const buttonLabel = submitButton.textContent;
  const loadedAt = Date.now();
  const MIN_FILL_MS = 3000;

  const setStatus = (state, message) => {
    status.hidden = false;
    status.dataset.state = state;
    status.textContent = message;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form));

    // Spam checks: hidden honeypot filled, or submitted faster than a person could type.
    if (data.botcheck || Date.now() - loadedAt < MIN_FILL_MS) {
      setStatus('error', 'We could not send your enquiry. Please wait a moment and try again.');
      return;
    }

    if (!data.access_key || data.access_key.startsWith('YOUR_')) {
      setStatus('error', 'The enquiry form is not configured yet. Please email support@vertex-sg.com directly.');
      return;
    }

    data.subject = `Website enquiry — ${data.name} (${data.company})`;
    data.from_name = 'Vertex website';
    delete data.botcheck;

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    setStatus('sending', 'Sending your enquiry…');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || `HTTP ${response.status}`);

      form.reset();
      setStatus('success', 'Thank you — your enquiry has been sent. A confirmation is on its way to your inbox and our team will reply within two business days.');
    } catch (error) {
      setStatus('error', 'Sorry, your enquiry was not sent. Please check your connection and try again, or email support@vertex-sg.com.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = buttonLabel;
    }
  });
}
