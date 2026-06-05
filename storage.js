/* ================================================
   STORAGE — API (database) + localStorage fallback
   ================================================ */

const Storage = (() => {
  const KEY = 'aiqm_sets';
  const SETTINGS_KEY = 'aiqm_settings';

  let apiAvailable = null;
  let dbProvider = null;

  function apiBase() {
    const cfg = window.APP_CONFIG?.API_BASE;
    if (cfg !== undefined && cfg !== '') return cfg.replace(/\/$/, '');
    if (typeof location !== 'undefined' && /^https?:/.test(location.protocol)) {
      return location.origin;
    }
    return '';
  }

  function canUseApi() {
    return Boolean(apiBase());
  }

  async function checkApi() {
    if (!canUseApi()) {
      apiAvailable = false;
      return false;
    }
    try {
      const res = await fetch(`${apiBase()}/api/health`, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error('health failed');
      const data = await res.json();
      apiAvailable = true;
      dbProvider = data.database || 'api';
      return true;
    } catch {
      apiAvailable = false;
      dbProvider = null;
      return false;
    }
  }

  async function ensureApi() {
    if (apiAvailable === null) await checkApi();
    return apiAvailable;
  }

  function loadLocal() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }

  function saveLocal(set) {
    const sets = loadLocal();
    const idx = sets.findIndex(s => s.id === set.id);
    if (idx > -1) sets[idx] = set;
    else sets.unshift(set);
    if (sets.length > 25) sets.splice(25);
    localStorage.setItem(KEY, JSON.stringify(sets));
    return set;
  }

  async function load() {
    if (await ensureApi()) {
      const res = await fetch(`${apiBase()}/api/sets`);
      if (!res.ok) throw new Error('Failed to load sets');
      return res.json();
    }
    return loadLocal();
  }

  async function save(set) {
    if (await ensureApi()) {
      const res = await fetch(`${apiBase()}/api/sets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: set.id,
          topic: set.topic,
          flashcards: set.flashcards,
          quiz: set.quiz,
        }),
      });
      if (!res.ok) throw new Error('Failed to save set');
      return res.json();
    }
    return saveLocal(set);
  }

  async function remove(id) {
    if (await ensureApi()) {
      const res = await fetch(`${apiBase()}/api/sets/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete set');
      return;
    }
    const sets = loadLocal().filter(s => s.id !== id);
    localStorage.setItem(KEY, JSON.stringify(sets));
  }

  async function get(id) {
    if (await ensureApi()) {
      const res = await fetch(`${apiBase()}/api/sets/${encodeURIComponent(id)}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to load set');
      return res.json();
    }
    return loadLocal().find(s => s.id === id) || null;
  }

  async function clearAll() {
    if (await ensureApi()) {
      const res = await fetch(`${apiBase()}/api/sets`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to clear sets');
      return;
    }
    localStorage.removeItem(KEY);
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function loadSettings() {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function getDbProvider() {
    return apiAvailable ? dbProvider : 'local';
  }

  function isUsingDatabase() {
    return apiAvailable === true;
  }

  return {
    load,
    save,
    remove,
    get,
    clearAll,
    saveSettings,
    loadSettings,
    checkApi,
    getDbProvider,
    isUsingDatabase,
  };
})();
