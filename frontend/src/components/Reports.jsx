import { useMemo, useState } from 'react';
import useAllData from './useAllData';
import { rupee, STATUS_ORDER } from '../config';

const sum = (a, f) => a.reduce((s, x) => s + Number(f(x)), 0);

function Grid({ cols, rows, empty = 'No data for these filters.' }) {
  return (
    <div className="panel table-wrap">
      <table>
        <thead><tr>{cols.map((c) => <th key={c.h} className={c.r ? 'right' : ''}>{c.h}</th>)}</tr></thead>
        <tbody>
          {!rows.length && <tr><td colSpan={cols.length} className="empty">{empty}</td></tr>}
          {rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c.h} className={c.r ? 'right' : ''}>{c.f ? c.f(r[c.k], r) : r[c.k]}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

export default function Reports() {
  const { data: d, error } = useAllData();
  const [tab, setTab] = useState('sales');
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const [bstatus, setBstatus] = useState('');
  const [minQty, setMinQty] = useState(1);
  const [s, setS] = useState({ status: '', staff: '', table: '', text: '' });

  const inRange = (date) => (!from || date >= from) && (!to || date <= to);

  const r = useMemo(() => {
    if (!d) return null;
    const find = (t, k, id) => d[t].find((x) => x[k] === id);
    const bills = d.bills.filter((b) => inRange(b.bill_date) && (!bstatus || b.status === bstatus));
    const items = d.menu_items.map((m) => {
      const lines = d.order_items.filter((l) => l.item_id === m.item_id && inRange(find('orders', 'order_id', l.order_id)?.order_date || ''));
      const qty = sum(lines, (l) => l.quantity);
      return { name: m.name, category: m.category, qty, revenue: qty * m.price };
    }).filter((x) => x.qty >= minQty).sort((a, b) => b.qty - a.qty);
    const methods = ['Cash', 'Card', 'UPI'].map((m) => {
      const p = d.payments.filter((x) => x.method === m && inRange(x.payment_date));
      return { method: m, count: p.length, total: sum(p, (x) => x.amount), avg: p.length ? sum(p, (x) => x.amount) / p.length : 0 };
    });
    const staff = d.staff.filter((x) => x.role === 'Waiter' || x.role === 'Manager').map((st) => {
      const o = d.orders.filter((x) => x.staff_id === st.staff_id && inRange(x.order_date));
      const billed = sum(o, (x) => d.bills.find((b) => b.order_id === x.order_id)?.total || 0);
      return { name: st.name, role: st.role, orders: o.length, billed };
    });
    const found = d.orders.filter((o) => inRange(o.order_date) && (!s.status || o.status === s.status) && (!s.staff || o.staff_id === Number(s.staff)) && (!s.table || o.table_id === Number(s.table))
      && (!s.text || (find('customers', 'customer_id', o.customer_id)?.name || 'walk-in').toLowerCase().includes(s.text.toLowerCase())))
      .map((o) => ({
        order: `#${o.order_id}`, customer: find('customers', 'customer_id', o.customer_id)?.name || 'Walk-in',
        table: `Table ${find('restaurant_tables', 'table_id', o.table_id)?.table_number}`, waiter: find('staff', 'staff_id', o.staff_id)?.name,
        date: o.order_date, status: o.status, total: d.bills.find((b) => b.order_id === o.order_id)?.total ?? null,
      }));
    return { bills, items, methods, staff, found };
  }, [d, from, to, bstatus, minQty, s]);

  if (error) return <p className="banner error">{error}</p>;
  if (!d) return <p className="muted">Loading reports…</p>;

  const tabs = [['sales', 'Sales summary'], ['items', 'Top items'], ['payments', 'Payments'], ['staff', 'Staff performance'], ['search', 'Order search']];
  const chip = (v) => <span className={'chip ' + String(v).toLowerCase()}>{v}</span>;

  return (
    <section>
      <header className="page-head"><div><h1>Reports and search</h1><p>Summaries that combine orders, bills, payments, menu and staff.</p></div></header>
      <div className="tabs">{tabs.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}</div>

      <div className="toolbar">
        <label className="inline">From <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label className="inline">To <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
        {tab === 'sales' && <select className="input" value={bstatus} onChange={(e) => setBstatus(e.target.value)}><option value="">All bills</option><option>Paid</option><option>Unpaid</option></select>}
        {tab === 'items' && <label className="inline">Min. quantity sold <input className="input narrow" type="number" min="1" value={minQty} onChange={(e) => setMinQty(Number(e.target.value) || 1)} /></label>}
        {tab === 'search' && <>
          <select className="input" value={s.status} onChange={(e) => setS({ ...s, status: e.target.value })}><option value="">Any status</option>{STATUS_ORDER.map((x) => <option key={x}>{x}</option>)}</select>
          <select className="input" value={s.staff} onChange={(e) => setS({ ...s, staff: e.target.value })}><option value="">Any waiter</option>{d.staff.filter((x) => x.role === 'Waiter').map((x) => <option key={x.staff_id} value={x.staff_id}>{x.name}</option>)}</select>
          <select className="input" value={s.table} onChange={(e) => setS({ ...s, table: e.target.value })}><option value="">Any table</option>{d.restaurant_tables.map((x) => <option key={x.table_id} value={x.table_id}>Table {x.table_number}</option>)}</select>
          <input className="input" placeholder="Customer name" value={s.text} onChange={(e) => setS({ ...s, text: e.target.value })} />
        </>}
        {(from || to) && <button className="btn ghost" onClick={() => { setFrom(''); setTo(''); }}>Clear dates</button>}
      </div>

      {tab === 'sales' && <>
        <div className="stats three">
          <div className="stat"><span>Total billed</span><strong>{rupee(sum(r.bills, (b) => b.total))}</strong><small>{r.bills.length} bills</small></div>
          <div className="stat"><span>Average bill</span><strong>{rupee(r.bills.length ? sum(r.bills, (b) => b.total) / r.bills.length : 0)}</strong><small>per order</small></div>
          <div className="stat"><span>Tax collected</span><strong>{rupee(sum(r.bills, (b) => b.tax))}</strong><small>5% on subtotal</small></div>
        </div>
        <Grid rows={r.bills} cols={[{ h: 'Bill', k: 'bill_id', f: (v) => `#${v}` }, { h: 'Order', k: 'order_id', f: (v) => `#${v}` }, { h: 'Date', k: 'bill_date' }, { h: 'Subtotal', k: 'subtotal', r: 1, f: rupee }, { h: 'Tax', k: 'tax', r: 1, f: rupee }, { h: 'Total', k: 'total', r: 1, f: rupee }, { h: 'Status', k: 'status', f: chip }]} />
      </>}
      {tab === 'items' && <Grid rows={r.items} cols={[{ h: 'Menu item', k: 'name' }, { h: 'Category', k: 'category' }, { h: 'Units sold', k: 'qty', r: 1 }, { h: 'Revenue', k: 'revenue', r: 1, f: rupee }]} />}
      {tab === 'payments' && <Grid rows={r.methods} cols={[{ h: 'Method', k: 'method' }, { h: 'Payments', k: 'count', r: 1 }, { h: 'Total collected', k: 'total', r: 1, f: rupee }, { h: 'Average payment', k: 'avg', r: 1, f: rupee }]} />}
      {tab === 'staff' && <Grid rows={r.staff} cols={[{ h: 'Name', k: 'name' }, { h: 'Role', k: 'role' }, { h: 'Orders handled', k: 'orders', r: 1 }, { h: 'Total billed', k: 'billed', r: 1, f: rupee }]} />}
      {tab === 'search' && <Grid rows={r.found} empty="No orders match all of these criteria." cols={[{ h: 'Order', k: 'order' }, { h: 'Customer', k: 'customer' }, { h: 'Table', k: 'table' }, { h: 'Waiter', k: 'waiter' }, { h: 'Date', k: 'date' }, { h: 'Status', k: 'status', f: chip }, { h: 'Bill total', k: 'total', r: 1, f: (v) => (v == null ? '—' : rupee(v)) }]} />}
    </section>
  );
}
