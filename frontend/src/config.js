// One place that describes every table: fields, validation rules and foreign keys.
// The forms, tables, validation and the mock database are all generated from this file.
// Column names match the suggested MySQL schema, so the backend can use the same names.

const STATUS_ORDER = ['Pending', 'Preparing', 'Served', 'Completed', 'Cancelled'];
export { STATUS_ORDER };

export const ENTITIES = {
  customers: {
    label: 'Customers', singular: 'customer', pk: 'customer_id', group: 'Manage',
    title: (r) => r.name,
    fields: [
      { name: 'name', label: 'Full name', type: 'text', required: true, max: 60 },
      { name: 'phone', label: 'Phone', type: 'text', required: true, unique: true, pattern: /^[0-9]{10}$/, patternMsg: 'Phone must be exactly 10 digits' },
      { name: 'email', label: 'Email', type: 'email', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, patternMsg: 'Enter a valid email address' },
      { name: 'loyalty_points', label: 'Loyalty points', type: 'number', min: 0, default: 0 },
    ],
  },
  menu_items: {
    label: 'Menu items', singular: 'menu item', pk: 'item_id', group: 'Manage',
    title: (r) => r.name,
    fields: [
      { name: 'name', label: 'Item name', type: 'text', required: true, unique: true, max: 80 },
      { name: 'category', label: 'Category', type: 'select', required: true, filter: true, options: ['Starter', 'Soup', 'Main Course', 'Bread', 'Dessert', 'Beverage'] },
      { name: 'price', label: 'Price', type: 'number', money: true, required: true, min: 1 },
      { name: 'is_available', label: 'Availability', type: 'select', numeric: true, default: 1, options: [{ value: 1, label: 'Available' }, { value: 0, label: 'Unavailable' }] },
    ],
  },
  restaurant_tables: {
    label: 'Tables', singular: 'table', pk: 'table_id', group: 'Manage',
    title: (r) => `Table ${r.table_number}`,
    fields: [
      { name: 'table_number', label: 'Table number', type: 'number', required: true, unique: true, min: 1 },
      { name: 'capacity', label: 'Seats', type: 'number', required: true, min: 1, max: 20 },
      { name: 'status', label: 'Status', type: 'select', default: 'Available', filter: true, options: ['Available', 'Occupied', 'Reserved'] },
    ],
  },
  staff: {
    label: 'Staff', singular: 'staff member', pk: 'staff_id', group: 'Manage',
    title: (r) => r.name,
    fields: [
      { name: 'name', label: 'Full name', type: 'text', required: true, max: 60 },
      { name: 'role', label: 'Role', type: 'select', required: true, filter: true, options: ['Manager', 'Chef', 'Waiter', 'Cashier'] },
      { name: 'phone', label: 'Phone', type: 'text', required: true, unique: true, pattern: /^[0-9]{10}$/, patternMsg: 'Phone must be exactly 10 digits' },
      { name: 'salary', label: 'Monthly salary', type: 'number', money: true, required: true, min: 0 },
      { name: 'hire_date', label: 'Hire date', type: 'date', required: true },
    ],
  },
  orders: {
    label: 'Orders', singular: 'order', pk: 'order_id', group: 'Service',
    title: (r) => `Order #${r.order_id}`,
    fields: [
      { name: 'customer_id', label: 'Customer', type: 'select', ref: 'customers' },
      { name: 'table_id', label: 'Table', type: 'select', ref: 'restaurant_tables', required: true },
      { name: 'staff_id', label: 'Served by', type: 'select', ref: 'staff', required: true },
      { name: 'order_date', label: 'Order date', type: 'date', required: true },
      { name: 'status', label: 'Status', type: 'select', default: 'Pending', filter: true, options: STATUS_ORDER },
    ],
  },
  order_items: {
    label: 'Order items', singular: 'order item', pk: 'order_item_id', group: 'Service',
    title: (r) => `Line #${r.order_item_id}`,
    fields: [
      { name: 'order_id', label: 'Order', type: 'select', ref: 'orders', required: true },
      { name: 'item_id', label: 'Menu item', type: 'select', ref: 'menu_items', required: true },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true, min: 1, max: 50, default: 1 },
    ],
  },
  bills: {
    label: 'Bills', singular: 'bill', pk: 'bill_id', group: 'Billing',
    title: (r) => `Bill #${r.bill_id}`,
    fields: [
      { name: 'order_id', label: 'Order', type: 'select', ref: 'orders', required: true, unique: true },
      { name: 'bill_date', label: 'Bill date', type: 'date', required: true },
      { name: 'subtotal', label: 'Subtotal', type: 'number', money: true, required: true, min: 0 },
      { name: 'tax', label: 'Tax (5%)', type: 'number', money: true, required: true, min: 0, default: 0 },
      { name: 'total', label: 'Total', type: 'number', money: true, required: true, min: 0 },
      { name: 'status', label: 'Status', type: 'select', default: 'Unpaid', filter: true, options: ['Unpaid', 'Paid'] },
    ],
  },
  payments: {
    label: 'Payments', singular: 'payment', pk: 'payment_id', group: 'Billing',
    title: (r) => `Payment #${r.payment_id}`,
    fields: [
      { name: 'bill_id', label: 'Bill', type: 'select', ref: 'bills', required: true },
      { name: 'amount', label: 'Amount', type: 'number', money: true, required: true, min: 1 },
      { name: 'method', label: 'Method', type: 'select', required: true, filter: true, options: ['Cash', 'Card', 'UPI'] },
      { name: 'payment_date', label: 'Payment date', type: 'date', required: true },
    ],
  },
};

export const rupee = (n) => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
export const labelOf = (entity, row) => (row ? ENTITIES[entity].title(row) : '—');
