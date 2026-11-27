// Demo data: 93 records across 8 tables (used only when no backend URL is set).
const names = ['Anita Naik', 'Rohan Fernandes', 'Priya Kamat', "Joao D'Souza", 'Sneha Gaonkar', 'Amit Prabhu', 'Maria Pereira', 'Vikram Shetty', 'Neha Borkar', 'Kevin Rodrigues'];
const menu = [
  ['Veg Spring Rolls', 'Starter', 180], ['Chicken Tikka', 'Starter', 260], ['Paneer Tikka', 'Starter', 240],
  ['Tomato Soup', 'Soup', 120], ['Goan Fish Curry Rice', 'Main Course', 320], ['Chicken Xacuti', 'Main Course', 340],
  ['Butter Naan', 'Bread', 40], ['Veg Biryani', 'Main Course', 220], ['Chicken Biryani', 'Main Course', 280],
  ['Dal Tadka', 'Main Course', 180], ['Bebinca', 'Dessert', 150], ['Gulab Jamun', 'Dessert', 90],
  ['Masala Chai', 'Beverage', 40], ['Fresh Lime Soda', 'Beverage', 70], ['Cold Coffee', 'Beverage', 110],
];
const staff = [['Suresh Kamat', 'Manager', 45000], ['Ravi Gawas', 'Chef', 38000], ['Deepa Naik', 'Waiter', 18000], ['Ajay Dessai', 'Waiter', 18000], ['Pooja Sawant', 'Cashier', 22000], ['Mohan Pai', 'Chef', 36000]];

export function buildSeed() {
  const db = { customers: [], menu_items: [], restaurant_tables: [], staff: [], orders: [], order_items: [], bills: [], payments: [] };
  names.forEach((n, i) => db.customers.push({ customer_id: i + 1, name: n, phone: '98220000' + (10 + i), email: n.toLowerCase().replace(/[^a-z]+/g, '.') + '@example.com', loyalty_points: (i * 35) % 200 }));
  menu.forEach(([name, category, price], i) => db.menu_items.push({ item_id: i + 1, name, category, price, is_available: i === 10 ? 0 : 1 }));
  [2, 2, 4, 4, 4, 6, 6, 8].forEach((c, i) => db.restaurant_tables.push({ table_id: i + 1, table_number: i + 1, capacity: c, status: ['Available', 'Occupied', 'Reserved'][i % 3] }));
  staff.forEach(([name, role, salary], i) => db.staff.push({ staff_id: i + 1, name, role, phone: '97640000' + (10 + i), salary, hire_date: `202${3 + (i % 3)}-0${1 + i}-15` }));
  const statuses = ['Completed', 'Completed', 'Served', 'Completed', 'Preparing', 'Completed', 'Pending', 'Completed', 'Completed', 'Cancelled', 'Preparing', 'Pending'];
  let lineId = 1;
  for (let i = 0; i < 12; i++) {
    const oid = i + 1;
    db.orders.push({ order_id: oid, customer_id: i % 5 === 4 ? null : (i % 10) + 1, table_id: (i % 8) + 1, staff_id: 3 + (i % 2), order_date: `2026-11-${String(10 + i).padStart(2, '0')}`, status: statuses[i] });
    let sub = 0;
    [[(i * 2) % 15, 1 + (i % 3)], [(i * 2 + 5) % 15, 2]].forEach(([m, q]) => { db.order_items.push({ order_item_id: lineId++, order_id: oid, item_id: m + 1, quantity: q }); sub += menu[m][2] * q; });
    if (oid <= 10) {
      const tax = Math.round(sub * 5) / 100;
      db.bills.push({ bill_id: oid, order_id: oid, bill_date: `2026-11-${String(10 + i).padStart(2, '0')}`, subtotal: sub, tax, total: sub + tax, status: oid <= 8 ? 'Paid' : 'Unpaid' });
      if (oid <= 8) db.payments.push({ payment_id: oid, bill_id: oid, amount: sub + tax, method: ['Cash', 'Card', 'UPI'][i % 3], payment_date: `2026-11-${String(10 + i).padStart(2, '0')}` });
    }
  }
  return db;
}
