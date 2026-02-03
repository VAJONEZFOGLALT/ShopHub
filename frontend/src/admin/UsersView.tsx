import { useEffect, useState } from 'react';
import { api } from '../api';

export default function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ username: '', email: '', password: '' });

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

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
    const message = 'Delete user #' + id + '?';
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

  return (
    <div className="view">
      <h2>Users</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>Username</span>
            <input value={form.username} onChange={e => updateForm({ username: e.target.value })} required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={e => updateForm({ email: e.target.value })} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={form.password} onChange={e => updateForm({ password: e.target.value })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>Create User</button>
      </form>

      <div className="list">
        {loading ? <p>Loading…</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u: any) => (
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
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td>
                    <button className="danger" onClick={() => onDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
