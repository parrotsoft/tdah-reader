const defaults = { letters: 3, largeText: false, focusLine: true };
const $ = (id) => document.getElementById(id);
const settings = { ...defaults };

async function activeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function send(message) {
  const tab = await activeTab();
  if (!tab?.id) throw new Error('No se encontró una pestaña activa.');
  return chrome.tabs.sendMessage(tab.id, message);
}

function showStatus(message) { $('status').textContent = message; }

async function persistAndApply() {
  await chrome.storage.sync.set(settings);
  try { await send({ type: 'SETTINGS_CHANGED', settings }); } catch { /* se aplica al abrir el lector */ }
}

async function init() {
  Object.assign(settings, await chrome.storage.sync.get(defaults));
  $('letters').value = settings.letters;
  $('letters-value').value = settings.letters;
  $('large-text').checked = settings.largeText;
  $('focus-line').checked = settings.focusLine;

  try {
    const state = await send({ type: 'GET_STATE' });
    $('toggle').textContent = state?.active ? 'Cerrar modo lector' : 'Activar modo lector';
  } catch {
    $('toggle').disabled = true;
    showStatus('Esta página no permite activar extensiones.');
  }
}

$('toggle').addEventListener('click', async () => {
  try {
    const state = await send({ type: 'TOGGLE_READER', settings });
    $('toggle').textContent = state.active ? 'Cerrar modo lector' : 'Activar modo lector';
    showStatus(state.active ? 'Modo lector activado.' : 'Modo lector cerrado.');
  } catch { showStatus('No fue posible activar el lector en esta página.'); }
});

$('letters').addEventListener('input', async (event) => {
  settings.letters = Number(event.target.value);
  $('letters-value').value = settings.letters;
  await persistAndApply();
});
for (const [id, key] of [['large-text', 'largeText'], ['focus-line', 'focusLine']]) {
  $(id).addEventListener('change', async (event) => { settings[key] = event.target.checked; await persistAndApply(); });
}
init();
