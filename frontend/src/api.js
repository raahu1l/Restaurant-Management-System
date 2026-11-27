// All data access goes through this file.
// - No VITE_API_URL  -> demo mode: data lives in the browser (localStorage), seeded with sample records.
// - VITE_API_URL set -> real mode: calls the REST API built by the backend teammate.
//
// REST contract (per table name, e.g. customers, menu_items, orders):
//   GET    {URL}/{table}        -> [ {...}, ... ]
//   POST   {URL}/{table}        -> created row
//   PUT    {URL}/{table}/{id}   -> updated row
//   DELETE {URL}/{table}/{id}  -> { success: true }
// Errors: respond with a non-2xx status and JSON { "error": "message to show the user" }.
import { ENTITIES } from './config';
import { buildSeed } from './seed';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const DEMO = !BASE;

/* ---------- real backend ---------- */
async function http(path, options) {
  let res;
  try {
    res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...options });
  } catch {
    throw new Error('Cannot reach the server. Check that the backend is running.');
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || body.message || `Request failed (${res.status})`);
  return body;
}

/* ---------- demo mode (mimics MySQL behaviour) ---------- */
const KEY = 'rms_demo_db_v1';
const load = () => {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch { /* ignore */ }
  const db = buildSeed(); localStorage.setItem(KEY, JSON.stringify(db)); return db;
};
const save = (db) => localStorage.setItem(KEY, JSON.stringify(db));
const wait = (v) => new Promise((r) => setTimeout(() => r(v), 120));

function checkUnique(db, table, row, ignoreId) {
  const E = ENTITIES[table];
  E.fields.filter((f) => f.unique).forEach((f) => {
    const dup = db[table].find((r) => String(r[f.name]).toLowerCase() === String(row[f.name]).toLowerCase() && r[E.pk] !== ignoreId);
    if (dup) throw new Error(`Duplicate entry '${row[f.name]}' for key '${f.name}'`);
  });
}
function checkForeignKeys(db, table, row) {
  ENTITIES[table].fields.filter((f) => f.ref && row[f.name] != null).forEach((f) => {
    if (!db[f.ref].some((r) => r[ENTITIES[f.ref].pk] === row[f.name])) throw new Error(`Foreign key constraint failed: ${f.name} does not exist in ${f.ref}`);
  });
}

const demo = {
  list: async (t) => wait(load()[t]),
  create: async (t, data) => {
    const db = load(); const E = ENTITIES[t];
    checkUnique(db, t, data); checkForeignKeys(db, t, data);
    const row = { [E.pk]: Math.max(0, ...db[t].map((r) => r[E.pk])) + 1, ...data };
    db[t].push(row); save(db); return wait(row);
  },
  update: async (t, id, data) => {
    const db = load(); const E = ENTITIES[t];
    checkUnique(db, t, data, id); checkForeignKeys(db, t, data);
    const i = db[t].findIndex((r) => r[E.pk] === id);
    db[t][i] = { ...db[t][i], ...data }; save(db); return wait(db[t][i]);
  },
  remove: async (t, id) => {
    const db = load();
    Object.entries(ENTITIES).forEach(([child, CE]) => CE.fields.filter((f) => f.ref === t).forEach((f) => {
      if (db[child].some((r) => r[f.name] === id)) throw new Error(`Cannot delete: this record is still used in ${CE.label.toLowerCase()} (${f.name}).`);
    }));
    db[t] = db[t].filter((r) => r[ENTITIES[t].pk] !== id); save(db); return wait({ success: true });
  },
};

const real = {
  list: (t) => http(`/${t}`),
  create: (t, d) => http(`/${t}`, { method: 'POST', body: JSON.stringify(d) }),
  update: (t, id, d) => http(`/${t}/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  remove: (t, id) => http(`/${t}/${id}`, { method: 'DELETE' }),
};

export const api = DEMO ? demo : real;
export const resetDemo = () => { localStorage.removeItem(KEY); };
