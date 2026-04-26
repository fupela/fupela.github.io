const DEFAULT_CALLS = [
  {
    name: 'Maria R.',
    phone: '(713) 555-0198',
    service: 'Water heater leaking',
    urgency: 'Urgent',
    address: 'Katy, TX',
    status: 'New',
    summary: 'Caller reported water collecting near the garage water heater and requested same-day help.'
  },
  {
    name: 'James T.',
    phone: '(832) 555-0144',
    service: 'Kitchen sink clog',
    urgency: 'Normal',
    address: 'Houston, TX',
    status: 'Contacted',
    summary: 'Caller wants availability for tomorrow morning and asked whether diagnostic fees apply.'
  }
];

const STORAGE_KEYS = {
  business: 'dispatchanchor.portal.businessProfile.v1',
  rules: 'dispatchanchor.portal.agentRules.v1',
  checklist: 'dispatchanchor.portal.checklist.v1',
  calls: 'dispatchanchor.portal.calls.v1'
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
  el.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:20;background:#0f172a;border:1px solid rgba(56,189,248,.35);color:#edf6ff;padding:12px 14px;border-radius:999px;box-shadow:0 18px 60px rgba(0,0,0,.35);font-weight:800;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1900);
}

function initForms() {
  const businessForm = document.querySelector('#businessForm');
  const rulesForm = document.querySelector('#rulesForm');
  hydrateForm(businessForm, loadJson(STORAGE_KEYS.business, {}));
  hydrateForm(rulesForm, loadJson(STORAGE_KEYS.rules, {}));

  businessForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveJson(STORAGE_KEYS.business, formToObject(businessForm));
    toast('Business profile saved locally.');
  });

  rulesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    saveJson(STORAGE_KEYS.rules, formToObject(rulesForm));
    toast('Agent settings saved locally.');
  });
}

function initChecklist() {
  const saved = loadJson(STORAGE_KEYS.checklist, {});
  const boxes = [...document.querySelectorAll('[data-check]')];
  const progress = document.querySelector('#progressCount');
  boxes.forEach((box) => {
    box.checked = Boolean(saved[box.dataset.check]);
    box.addEventListener('change', () => {
      const next = Object.fromEntries(boxes.map((item) => [item.dataset.check, item.checked]));
      saveJson(STORAGE_KEYS.checklist, next);
      updateProgress();
    });
  });

  function updateProgress() {
    progress.textContent = String(boxes.filter((box) => box.checked).length);
  }
  updateProgress();
}

function renderCalls() {
  const calls = loadJson(STORAGE_KEYS.calls, DEFAULT_CALLS);
  const list = document.querySelector('#callList');
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
  document.querySelector('#addDemoCall').addEventListener('click', () => {
    const calls = loadJson(STORAGE_KEYS.calls, DEFAULT_CALLS);
    calls.unshift({
      name: 'Demo Caller',
      phone: '(281) 555-0101',
      service: 'After-hours service request',
      urgency: calls.length % 2 ? 'Urgent' : 'Normal',
      address: 'Houston area',
      status: 'New',
      summary: 'Alex collected the caller details, service issue, urgency, and preferred callback time.'
    });
    saveJson(STORAGE_KEYS.calls, calls.slice(0, 8));
    renderCalls();
    toast('Demo call added to the local database preview.');
  });
}

function initNavState() {
  const links = [...document.querySelectorAll('.nav-list a')];
  links.forEach((link) => {
    link.addEventListener('click', () => {
      links.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

initForms();
initChecklist();
initCalls();
initNavState();
