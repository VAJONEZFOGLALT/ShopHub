import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ADMIN_UI, formatPageLabel } from './adminUiText';

export default function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const skeletonRows = Array.from({ length: 5 });

  const updateForm = (patch: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...patch }));
  };

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [query]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.username.trim()) {
      setError('A felhasználónév megadása kötelező');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Érvényes e-mail cím megadása kötelező');
      return;
    }
    if (form.password.trim().length < 8) {
      setError('A jelszónak legalább 8 karakteresnek kell lennie');
      return;
    }
    try {
      const payload = { username: form.username, email: form.email, password: form.password };
      await api.createUser(payload);
      setForm({ username: '', email: '', password: '' });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onDelete(id: number) {
    const message = 'Biztosan törlöd a felhasználót? #' + id;
    const ok = confirm(message);
    if (!ok) {
      return;
    }
    try {
      await api.deleteUser(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onRoleChange(id: number, role: string) {
    setError(null);
    try {
      await api.updateUser(id, { role });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? users.filter((u: any) =>
        String(u.username || '').toLowerCase().includes(trimmed) ||
        String(u.email || '').toLowerCase().includes(trimmed)
      )
    : users;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedUsers = filtered.slice(start, start + pageSize);

  return (
    <div className="view">
      <h2>Felhasználók</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>Felhasználónév</span>
            <input value={form.username} onChange={e => updateForm({ username: e.target.value })} required />
          </label>
          <label>
            <span>E-mail</span>
            <input type="email" value={form.email} onChange={e => updateForm({ email: e.target.value })} required />
          </label>
          <label>
            <span>Jelszó</span>
            <input type="password" value={form.password} onChange={e => updateForm({ password: e.target.value })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>Felhasználó létrehozása</button>
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Keresés felhasználónév vagy e-mail alapján"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="list">
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Felhasználónév</th>
                <th>E-mail</th>
                <th>Szerepkör</th>
                <th>{ADMIN_UI.actions}</th>
              </tr>
            </thead>
            <tbody>
              {skeletonRows.map((_, idx) => (
                <tr key={`s-${idx}`}>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : pagedUsers.length === 0 ? (
          <p className="muted">{ADMIN_UI.empty}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Felhasználónév</th>
                <th>E-mail</th>
                <th>Szerepkör</th>
                <th>{ADMIN_UI.actions}</th>
              </tr>
            </thead>
            <tbody>
              {pagedUsers.map((u: any) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      value={u.role || 'USER'} 
                      onChange={(e) => onRoleChange(u.id, e.target.value)}
                      disabled={loading}
                    >
                      <option value="USER">Felhasználó</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button className="danger" onClick={() => onDelete(u.id)}>Törlés</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filtered.length > pageSize && (
        <div className="pager">
          <button type="button" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            {ADMIN_UI.previous}
          </button>
          <span className="muted">{formatPageLabel(currentPage, totalPages)}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
            {ADMIN_UI.next}
          </button>
        </div>
      )}
    </div>
  );
}
