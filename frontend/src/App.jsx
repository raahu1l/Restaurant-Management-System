import { useEffect, useState, useCallback } from 'react';
import { ENTITIES } from './config';
import { DEMO, resetDemo } from './api';
import Dashboard from './components/Dashboard';
import CrudPage from './components/CrudPage';
import Reports from './components/Reports';

const GROUPS = ['Manage', 'Service', 'Billing'];

export default function App() {
  const read = () => window.location.hash.replace('#/', '') || 'dashboard';
  const [page, setPage] = useState(read());
  const [toasts, setToasts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { const h = () => setPage(read()); window.addEventListener('hashchange', h); return () => window.removeEventListener('hashchange', h); }, []);
  const go = (p) => { window.location.hash = '#/' + p; setMenuOpen(false); };
  const toast = useCallback((msg, type = 'ok') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  return (
    <div className="app">
      <button className="burger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">☰</button>
      <aside className={menuOpen ? 'side open' : 'side'}>
        <div className="brand"><b>Saffron &amp; Slate</b><span>Restaurant manager</span></div>
        <nav>
          <button className={page === 'dashboard' ? 'on' : ''} onClick={() => go('dashboard')}>Dashboard</button>
          {GROUPS.map((g) => (
            <div key={g}>
              <p className="nav-group">{g}</p>
              {Object.entries(ENTITIES).filter(([, e]) => e.group === g).map(([k, e]) => (
                <button key={k} className={page === k ? 'on' : ''} onClick={() => go(k)}>{e.label}</button>
              ))}
            </div>
          ))}
          <p className="nav-group">Insights</p>
          <button className={page === 'reports' ? 'on' : ''} onClick={() => go('reports')}>Reports and search</button>
        </nav>
        <div className="side-foot">
          <span className={DEMO ? 'mode demo' : 'mode live'}>{DEMO ? 'Demo data (no backend)' : 'Connected to MySQL API'}</span>
          {DEMO && <button className="link" onClick={() => { resetDemo(); window.location.reload(); }}>Reset demo data</button>}
        </div>
      </aside>

      <main>
        {page === 'dashboard' && <Dashboard go={go} />}
        {page === 'reports' && <Reports />}
        {ENTITIES[page] && <CrudPage key={page} name={page} toast={toast} />}
      </main>

      <div className="toasts" role="status">{toasts.map((t) => <div key={t.id} className={'toast ' + t.type}>{t.msg}</div>)}</div>
    </div>
  );
}
