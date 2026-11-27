import { useEffect, useMemo, useState } from 'react';
import { ENTITIES, labelOf, rupee } from '../config';
import { api } from '../api';

const isEmpty = (v) => v === undefined || v === null || String(v).trim() === '';

export default function CrudPage({ name, toast }) {
  const E = ENTITIES[name];
  const [rows, setRows] = useState([]);
  const [refs, setRefs] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState({ key: E.pk, dir: 1 });
  const [form, setForm] = useState(null); // { id|null, values }
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const filterField = E.fields.find((f) => f.filter);

  const load = async () => {
    setLoading(true);
    try {
      setRows(await api.list(name));
      const o = {};
      for (const e of new Set(E.fields.filter((f) => f.ref).map((f) => f.ref))) o[e] = await api.list(e);
      setRefs(o);
    } catch (e) { toast(e.message, 'error'); }
    setLoading(false);
  };
  useEffect(() => { setQ(''); setFilter(''); setForm(null); setSort({ key: E.pk, dir: 1 }); load(); }, [name]);

  const show = (f, row) => {
    const v = row[f.name];
    if (isEmpty(v)) return '—';
    if (f.ref) return labelOf(f.ref, refs[f.ref]?.find((r) => r[ENTITIES[f.ref].pk] === v));
    if (f.options && typeof f.options[0] === 'object') return f.options.find((o) => o.value === v)?.label ?? v;
    return f.money ? rupee(v) : v;
  };

  const visible = useMemo(() => {
    const t = q.trim().toLowerCase();
    let list = rows.filter((r) => (!filter || r[filterField.name] === filter) && (!t || E.fields.some((f) => String(show(f, r)).toLowerCase().includes(t))));
    list = [...list].sort((a, b) => (a[sort.key] > b[sort.key] ? 1 : a[sort.key] < b[sort.key] ? -1 : 0) * sort.dir);
    return list;
  }, [rows, refs, q, filter, sort]);

  const openForm = (row) => {
    const values = {};
    E.fields.forEach((f) => { values[f.name] = row ? (row[f.name] ?? '') : (f.default ?? ''); });
    setErrors({}); setForm({ id: row ? row[E.pk] : null, values });
  };

  const validate = (v) => {
    const err = {};
    E.fields.forEach((f) => {
      const val = v[f.name];
      if (isEmpty(val)) { if (f.required) err[f.name] = `${f.label} is required`; return; }
      if (f.type === 'number') {
        if (isNaN(Number(val))) err[f.name] = `${f.label} must be a number`;
        else if (f.min !== undefined && Number(val) < f.min) err[f.name] = `${f.label} must be at least ${f.min}`;
        else if (f.max !== undefined && Number(val) > f.max) err[f.name] = `${f.label} must be at most ${f.max}`;
      } else if (f.max && String(val).length > f.max) err[f.name] = `${f.label} can have at most ${f.max} characters`;
      if (!err[f.name] && f.pattern && !f.pattern.test(String(val))) err[f.name] = f.patternMsg || `${f.label} is not valid`;
      if (!err[f.name] && f.unique && rows.some((r) => r[E.pk] !== form.id && String(r[f.name]).toLowerCase() === String(val).toLowerCase())) err[f.name] = `${f.label} already exists (duplicate key)`;
    });
    return err;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate(form.values);
    setErrors(err);
    if (Object.keys(err).length) { toast('Please fix the highlighted fields', 'error'); return; }
    const data = {};
    E.fields.forEach((f) => {
      const v = form.values[f.name];
      data[f.name] = isEmpty(v) ? null : (f.type === 'number' || f.ref || f.numeric) ? Number(v) : v;
    });
    setSaving(true);
    try {
      if (form.id == null) await api.create(name, data); else await api.update(name, form.id, data);
      toast(form.id == null ? `${E.label} record added` : 'Changes saved', 'ok');
      setForm(null); load();
    } catch (ex) { toast(ex.message, 'error'); }
    setSaving(false);
  };

  const confirmDelete = async () => {
    try { await api.remove(name, toDelete[E.pk]); toast('Record deleted', 'ok'); load(); }
    catch (ex) { toast(ex.message, 'error'); }
    setToDelete(null);
  };

  const setVal = (n, v) => setForm((f) => ({ ...f, values: { ...f.values, [n]: v } }));
  const optionsFor = (f) => f.ref
    ? (refs[f.ref] || []).map((r) => ({ value: r[ENTITIES[f.ref].pk], label: labelOf(f.ref, r) }))
    : f.options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }));

  return (
    <section>
      <header className="page-head">
        <div><h1>{E.label}</h1><p>{rows.length} records in total</p></div>
        <button className="btn primary" onClick={() => openForm(null)}>Add {E.singular}</button>
      </header>

      <div className="toolbar">
        <input className="input search" placeholder={`Search ${E.label.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        {filterField && (
          <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter">
            <option value="">All {filterField.label.toLowerCase()}</option>
            {filterField.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        )}
        {(q || filter) && <button className="btn ghost" onClick={() => { setQ(''); setFilter(''); }}>Clear</button>}
      </div>

      <div className="panel table-wrap">
        <table>
          <thead><tr>
            <th onClick={() => setSort({ key: E.pk, dir: sort.key === E.pk ? -sort.dir : 1 })} className="sortable">ID</th>
            {E.fields.map((f) => (
              <th key={f.name} className="sortable" onClick={() => setSort({ key: f.name, dir: sort.key === f.name ? -sort.dir : 1 })}>
                {f.label}{sort.key === f.name ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}
              </th>
            ))}
            <th className="right">Actions</th>
          </tr></thead>
          <tbody>
            {loading && <tr><td colSpan={E.fields.length + 2} className="empty">Loading records…</td></tr>}
            {!loading && !visible.length && <tr><td colSpan={E.fields.length + 2} className="empty">No records match. Try clearing the search or add a new {E.singular}.</td></tr>}
            {visible.map((r) => (
              <tr key={r[E.pk]}>
                <td className="muted">{r[E.pk]}</td>
                {E.fields.map((f) => <td key={f.name}>{f.name === 'status' || f.name === 'is_available' ? <span className={'chip ' + String(show(f, r)).toLowerCase()}>{show(f, r)}</span> : show(f, r)}</td>)}
                <td className="right actions">
                  <button className="btn small" onClick={() => openForm(r)}>Edit</button>
                  <button className="btn small danger" onClick={() => setToDelete(r)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setForm(null)}>
          <form className="modal" onSubmit={submit} noValidate>
            <h2>{form.id == null ? 'Add' : 'Edit'} {E.singular}</h2>
            <div className="grid">
              {E.fields.map((f) => (
                <label key={f.name} className={errors[f.name] ? 'field has-error' : 'field'}>
                  <span>{f.label}{f.required && <b className="req"> *</b>}</span>
                  {f.type === 'select' ? (
                    <select className="input" value={form.values[f.name]} onChange={(e) => setVal(f.name, e.target.value)}>
                      <option value="">{f.required ? 'Select…' : 'None'}</option>
                      {optionsFor(f).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input className="input" type={f.type === 'email' ? 'text' : f.type} step={f.money ? '0.01' : undefined}
                      value={form.values[f.name]} onChange={(e) => setVal(f.name, e.target.value)} />
                  )}
                  {errors[f.name] && <em>{errors[f.name]}</em>}
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancel</button>
              <button className="btn primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}

      {toDelete && (
        <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && setToDelete(null)}>
          <div className="modal small-modal">
            <h2>Delete {E.title(toDelete)}?</h2>
            <p className="muted">This permanently removes the record. It cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn ghost" onClick={() => setToDelete(null)}>Keep it</button>
              <button className="btn danger solid" onClick={confirmDelete}>Delete record</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
