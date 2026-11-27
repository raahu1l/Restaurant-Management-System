const pool = require('../config/db');

exports.dashboard = async (req, res, next) => {
  try {
    const [[counts]] = await pool.query(`SELECT
      (SELECT COUNT(*) FROM customers) AS customers,
      (SELECT COUNT(*) FROM menu_items) AS menu_items,
      (SELECT COUNT(*) FROM orders) AS orders,
      (SELECT COUNT(*) FROM orders WHERE status IN ('Pending','Preparing')) AS active_orders,
      (SELECT COALESCE(SUM(total),0) FROM bills WHERE status='Paid') AS revenue,
      (SELECT COUNT(*) FROM bills WHERE status='Unpaid') AS unpaid_bills`);
    res.json(counts);
  } catch (e) { next(e); }
};
exports.salesByDay = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`SELECT bill_date AS date, COUNT(*) AS bills, SUM(total) AS revenue
      FROM bills WHERE status='Paid' AND bill_date BETWEEN COALESCE(?, '1000-01-01') AND COALESCE(?, '9999-12-31')
      GROUP BY bill_date ORDER BY bill_date`, [req.query.startDate || null, req.query.endDate || null]);
    res.json(rows);
  } catch (e) { next(e); }
};
exports.topItems = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT mi.item_id, mi.name, mi.category, SUM(oi.quantity) AS units_sold,
      SUM(oi.quantity * mi.price) AS sales_value FROM menu_items mi
      JOIN order_items oi ON oi.item_id=mi.item_id JOIN orders o ON o.order_id=oi.order_id
      WHERE o.status <> 'Cancelled' GROUP BY mi.item_id, mi.name, mi.category
      ORDER BY units_sold DESC, sales_value DESC LIMIT 10`);
    res.json(rows);
  } catch (e) { next(e); }
};
exports.staffPerformance = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT s.staff_id, s.name, s.role, COUNT(o.order_id) AS orders_handled,
      COALESCE(SUM(b.total),0) AS billed_value FROM staff s
      LEFT JOIN orders o ON o.staff_id=s.staff_id LEFT JOIN bills b ON b.order_id=o.order_id
      GROUP BY s.staff_id, s.name, s.role ORDER BY orders_handled DESC`);
    res.json(rows);
  } catch (e) { next(e); }
};
exports.paymentMethods = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT method, COUNT(*) AS transactions, SUM(amount) AS collected
      FROM payments GROUP BY method HAVING SUM(amount)>0 ORDER BY collected DESC`);
    res.json(rows);
  } catch (e) { next(e); }
};
exports.outstandingBills = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM v_bill_payment_summary WHERE balance_due>0 ORDER BY balance_due DESC`);
    res.json(rows);
  } catch (e) { next(e); }
};
