const DEFAULT_CALLS = [
  {
    name: 'Maria R.',
    phone: '(713) 555-0198',
    service: 'Water heater leaking',
    urgency: 'Urgent',
    address: 'Katy, TX',
    status: 'New',
    summary: 'Alex collected the caller details, urgency, location, and preferred callback window.'
  },
  {
    name: 'James T.',
    phone: '(832) 555-0144',
    service: 'Kitchen sink clog',
    urgency: 'Normal',
    address: 'Houston, TX',
    status: 'Contacted',
    summary: 'Caller wants tomorrow morning availability and asked whether diagnostic fees apply.'
  }
];

const STORAGE_KEYS = {
  profile: 'dispatchanchor.portal.profileForm.v2',
  calls: 'dispatchanchor.portal.calls.v2'
};

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (_) {
    return fallback;
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function hydrateForm(form, data) {
  Object.entries(data || {}).forEach(([key, value]) => {
    const field = form.elements[key];
    if (field) field.value = value;
  });
}

function toast(message) {
  const el = document.createElement('div');
  el.textContent = message;
  el.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:20;background:#101c33;border:1px solid rgba(255,138,60,.35);color:#f5f2ec;padding:12px 14px;border-radius:999px;box-shadow:0 18px 60px rgba(0,0,0,.35);font-weight:900;max-width:calc(100% - 28px);text-align:center;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function initProfileForm() {
  const profileForm = document.querySelector('#profileForm');
  const saveState = document.querySelector('#profileSaveState');
  if (!profileForm) return;

  const saved = loadJson(STORAGE_KEYS.profile, {});
  hydrateForm(profileForm, saved);
  if (Object.keys(saved).length && saveState) saveState.textContent = 'Saved on this device';

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveJson(STORAGE_KEYS.profile, formToObject(profileForm));
    if (saveState) saveState.textContent = 'Saved locally';
    toast('Business setup profile saved locally.');
  });
}

function renderCalls() {
  const calls = loadJson(STORAGE_KEYS.calls, DEFAULT_CALLS);
  const list = document.querySelector('#callList');
  if (!list) return;
  list.innerHTML = calls.map((call) => {
    const urgentClass = call.urgency === 'Urgent' ? ' urgent' : '';
    return `
      <article class="call-card">
        <div>
          <h3>${call.name} · ${call.service}</h3>
          <p>${call.summary}</p>
          <div class="call-meta">
            <span>${call.phone}</span>
            <span>${call.address}</span>
            <span>${call.urgency}</span>
          </div>
        </div>
        <div class="call-status${urgentClass}">${call.status}</div>
      </article>
    `;
  }).join('');
}

function initCalls() {
  if (!localStorage.getItem(STORAGE_KEYS.calls)) {
    saveJson(STORAGE_KEYS.calls, DEFAULT_CALLS);
  }
  renderCalls();
  const button = document.querySelector('#addDemoCall');
  if (!button) return;
  button.addEventListener('click', () => {
    const calls = loadJson(STORAGE_KEYS.calls, DEFAULT_CALLS);
    calls.unshift({
      name: 'Demo Caller',
      phone: '(281) 555-0101',
      service: 'After-hours service request',
      urgency: calls.length % 2 ? 'Urgent' : 'Normal',
      address: 'Houston area',
      status: 'New',
      summary: 'Alex collected service issue, urgency, preferred appointment time, and sent the portal profile link.'
    });
    saveJson(STORAGE_KEYS.calls, calls.slice(0, 8));
    renderCalls();
    toast('Demo call added to the local database preview.');
  });
}

initProfileForm();
initCalls();
