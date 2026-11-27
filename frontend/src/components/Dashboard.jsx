import useAllData from './useAllData';
import { rupee, STATUS_ORDER } from '../config';

export default function Dashboard({ go }) {
  const { data: d, error } = useAllData();
  if (error) return <p className="banner error">{error}</p>;
  if (!d) return <p className="muted">Loading dashboard…</p>;

  const paid = d.bills.filter((b) => b.status === 'Paid');
  const revenue = paid.reduce((s, b) => s + Number(b.total), 0);
  const unpaid = d.bills.filter((b) => b.status === 'Unpaid').reduce((s, b) => s + Number(b.total), 0);
  const free = d.restaurant_tables.filter((t) => t.status === 'Available').length;
  const byStatus = STATUS_ORDER.map((s) => ({ s, n: d.orders.filter((o) => o.status === s).length }));
  const max = Math.max(1, ...byStatus.map((x) => x.n));
  const recent = [...d.orders].sort((a, b) => b.order_id - a.order_id).slice(0, 5);
  const cust = (id) => d.customers.find((c) => c.customer_id === id)?.name || 'Walk-in';
  const bill = (id) => d.bills.find((b) => b.order_id === id);

  return (
    <section>
      <header className="page-head"><div><h1>Today at the restaurant</h1><p>A quick look at sales, orders and tables.</p></div></header>

      <div className="stats">
        <div className="stat hero"><span>Revenue collected</span><strong>{rupee(revenue)}</strong><small>{paid.length} paid bills, {rupee(unpaid)} still unpaid</small></div>
        <div className="stat"><span>Orders</span><strong>{d.orders.length}</strong><small>{d.orders.filter((o) => ['Pending', 'Preparing'].includes(o.status)).length} in the kitchen</small></div>
        <div className="stat"><span>Free tables</span><strong>{free}/{d.restaurant_tables.length}</strong><small>ready for guests</small></div>
        <div className="stat"><span>Customers</span><strong>{d.customers.length}</strong><small>{d.staff.length} staff on the team</small></div>
      </div>

      <div className="two-col">
        <div className="panel pad">
          <h3>Orders by status</h3>
          {byStatus.map(({ s, n }) => (
            <div className="bar-row" key={s}><span>{s}</span><div className="bar"><i className={'c-' + s.toLowerCase()} style={{ width: `${(n / max) * 100}%` }} /></div><b>{n}</b></div>
          ))}
        </div>
        <div className="panel pad">
          <div className="row-between"><h3>Latest orders</h3><button className="btn small" onClick={() => go('orders')}>View all</button></div>
          <table className="plain"><tbody>
            {recent.map((o) => (
              <tr key={o.order_id}><td>Order #{o.order_id}</td><td>{cust(o.customer_id)}</td><td><span className={'chip ' + o.status.toLowerCase()}>{o.status}</span></td><td className="right">{bill(o.order_id) ? rupee(bill(o.order_id).total) : '—'}</td></tr>
            ))}
          </tbody></table>
        </div>
      </div>
    </section>
  );
}
