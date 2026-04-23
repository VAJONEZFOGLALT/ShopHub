import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';

export default function UsersView() {
  const { t } = useTranslation();
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
      setError(t('admin.common.requiredUsername'));
      return;
    }
    if (!form.email.includes('@')) {
      setError(t('admin.common.requiredEmail'));
      return;
    }
    if (form.password.trim().length < 8) {
      setError(t('admin.common.passwordTooShort'));
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
    const message = t('admin.common.confirmDeleteUser', { id });
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
      <h2>{t('admin.users')}</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>{t('admin.common.username')}</span>
            <input value={form.username} onChange={e => updateForm({ username: e.target.value })} required />
          </label>
          <label>
            <span>{t('admin.common.email')}</span>
            <input type="email" value={form.email} onChange={e => updateForm({ email: e.target.value })} required />
          </label>
          <label>
            <span>{t('admin.common.password')}</span>
            <input type="password" value={form.password} onChange={e => updateForm({ password: e.target.value })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>{t('admin.common.createUser')}</button>
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t('admin.common.searchByUsernameOrEmail')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="list">
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>{t('admin.common.id')}</th>
                <th>{t('admin.common.username')}</th>
                <th>{t('admin.common.email')}</th>
                <th>{t('admin.common.role')}</th>
                <th>{t('admin.common.actions')}</th>
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
          <p className="muted">{t('admin.common.noUsersFound')}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('admin.common.id')}</th>
                <th>{t('admin.common.username')}</th>
                <th>{t('admin.common.email')}</th>
                <th>{t('admin.common.role')}</th>
                <th>{t('admin.common.actions')}</th>
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
                      <option value="USER">{t('admin.roles.user')}</option>
                      <option value="ADMIN">{t('admin.roles.admin')}</option>
                    </select>
                  </td>
                  <td>
                    <button className="danger" onClick={() => onDelete(u.id)}>{t('admin.common.delete')}</button>
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
            {t('admin.common.prev')}
          </button>
          <span className="muted">{t('admin.common.page', { current: currentPage, total: totalPages })}</span>
          <button type="button" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
            {t('admin.common.next')}
          </button>
        </div>
      )}
    </div>
  );
}
