import { useEffect, useState } from 'react';
import { api } from '../api';

const TABLES = ['customers', 'menu_items', 'restaurant_tables', 'staff', 'orders', 'order_items', 'bills', 'payments'];
// Loads every table once; dashboard and reports do their joins/grouping on this data.
export default function useAllData() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const o = {};
        for (const t of TABLES) o[t] = await api.list(t);
        setData(o);
      } catch (e) { setError(e.message); }
    })();
  }, []);
  return { data, error };
}
