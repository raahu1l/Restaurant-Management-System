const pool = require('../config/db');

// Allow-list is important: SQL identifiers cannot be safely parameterized like values.
const ENTITIES = {
  customers: { pk: 'customer_id', columns: ['name','phone','email','loyalty_points'], searchable: ['name','phone','email'] },
  menu_items: { pk: 'item_id', columns: ['name','category','price','is_available'], searchable: ['name','category'], dateColumn: null, amountColumn: 'price' },
  restaurant_tables: { pk: 'table_id', columns: ['table_number','capacity','status'], searchable: ['status'] },
  staff: { pk: 'staff_id', columns: ['name','role','phone','salary','hire_date'], searchable: ['name','role','phone'], dateColumn: 'hire_date', amountColumn: 'salary' },
  orders: { pk: 'order_id', columns: ['customer_id','table_id','staff_id','order_date','status'], searchable: ['status'], dateColumn: 'order_date' },
  order_items: { pk: 'order_item_id', columns: ['order_id','item_id','quantity'], searchable: [] },
  bills: { pk: 'bill_id', columns: ['order_id','bill_date','subtotal','tax','total','status'], searchable: ['status'], dateColumn: 'bill_date', amountColumn: 'total' },
  payments: { pk: 'payment_id', columns: ['bill_id','amount','method','payment_date'], searchable: ['method'], dateColumn: 'payment_date', amountColumn: 'amount' }
};
function definition(req, res) {
  const entity = ENTITIES[req.params.entity];
  if (!entity) { res.status(404).json({ error: 'Unknown resource.' }); return null; }
  return entity;
}
function cleanPayload(body, entity) {
  const result = {};
  for (const column of entity.columns) {
    if (Object.prototype.hasOwnProperty.call(body, column)) result[column] = body[column] === '' ? null : body[column];
  }
  return result;
}

exports.list = async (req, res, next) => {
  const entity = definition(req, res); if (!entity) return;
  try {
    const filters = []; const values = [];
    // Exact filters for all recognized columns.
    for (const column of entity.columns) {
      if (req.query[column] !== undefined && req.query[column] !== '') {
        filters.push(`\`${column}\` = ?`); values.push(req.query[column]);
      }
    }
    // Multi-field text search.
    if (req.query.search && entity.searchable?.length) {
      filters.push(`(${entity.searchable.map(c => `\`${c}\` LIKE ?`).join(' OR ')})`);
      entity.searchable.forEach(() => values.push(`%${req.query.search}%`));
    }
    // Date range filters for entities with a date field.
    if (entity.dateColumn && req.query.startDate) { filters.push(`\`${entity.dateColumn}\` >= ?`); values.push(req.query.startDate); }
    if (entity.dateColumn && req.query.endDate) { filters.push(`\`${entity.dateColumn}\` <= ?`); values.push(req.query.endDate); }
    // Numeric range filters for entities with an amount field.
    if (entity.amountColumn && req.query.minAmount !== undefined && req.query.minAmount !== '') { filters.push(`\`${entity.amountColumn}\` >= ?`); values.push(req.query.minAmount); }
    if (entity.amountColumn && req.query.maxAmount !== undefined && req.query.maxAmount !== '') { filters.push(`\`${entity.amountColumn}\` <= ?`); values.push(req.query.maxAmount); }

    const allowedSort = [...entity.columns, entity.pk];
    const sortBy = allowedSort.includes(req.query.sortBy) ? req.query.sortBy : entity.pk;
    const order = String(req.query.order).toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const [rows] = await pool.execute(`SELECT * FROM \`${req.params.entity}\` ${where} ORDER BY \`${sortBy}\` ${order}`, values);
    res.json(rows);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  const entity = definition(req, res); if (!entity) return;
  try {
    const data = cleanPayload(req.body || {}, entity); const columns = Object.keys(data);
    if (!columns.length) return res.status(400).json({ error: 'Provide at least one valid field.' });
    const placeholders = columns.map(() => '?').join(', ');
    const [result] = await pool.execute(`INSERT INTO \`${req.params.entity}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${placeholders})`, columns.map(c => data[c]));
    const [rows] = await pool.execute(`SELECT * FROM \`${req.params.entity}\` WHERE \`${entity.pk}\` = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  const entity = definition(req, res); if (!entity) return;
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Record ID must be a positive integer.' });
  try {
    const data = cleanPayload(req.body || {}, entity); const columns = Object.keys(data);
    if (!columns.length) return res.status(400).json({ error: 'Provide at least one valid field to update.' });
    const assignments = columns.map(c => `\`${c}\` = ?`).join(', ');
    const [result] = await pool.execute(`UPDATE \`${req.params.entity}\` SET ${assignments} WHERE \`${entity.pk}\` = ?`, [...columns.map(c => data[c]), req.params.id]);
    if (!result.affectedRows) {
      const [existing] = await pool.execute(`SELECT * FROM \`${req.params.entity}\` WHERE \`${entity.pk}\` = ?`, [req.params.id]);
      if (!existing.length) return res.status(404).json({ error: 'Record not found.' });
      return res.json(existing[0]);
    }
    const [rows] = await pool.execute(`SELECT * FROM \`${req.params.entity}\` WHERE \`${entity.pk}\` = ?`, [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  const entity = definition(req, res); if (!entity) return;
  if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: 'Record ID must be a positive integer.' });
  try {
    const [result] = await pool.execute(`DELETE FROM \`${req.params.entity}\` WHERE \`${entity.pk}\` = ?`, [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Record not found.' });
    res.json({ success: true });
  } catch (error) { next(error); }
};
