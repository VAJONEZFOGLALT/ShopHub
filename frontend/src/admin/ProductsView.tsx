import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ProductsView() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ name: '', description: '', category: '', price: 0, stock: 0 });

  const updateForm = (patch: Partial<typeof form>) => {
    setForm(prev => ({ ...prev, ...patch }));
  };

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProducts();
      setProducts(data);
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
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      await api.createProduct(payload);
      setForm({ name: '', description: '', category: '', price: 0, stock: 0 });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function onDelete(id: number) {
    const message = 'Delete product #' + id + '?';
    const ok = confirm(message);
    if (!ok) {
      return;
    }
    try {
      await api.deleteProduct(id);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="view">
      <h2>Products</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>Name</span>
            <input value={form.name} onChange={e => updateForm({ name: e.target.value })} required />
          </label>
          <label>
            <span>Description</span>
            <input value={form.description} onChange={e => updateForm({ description: e.target.value })} />
          </label>
          <label>
            <span>Category</span>
            <input value={form.category} onChange={e => updateForm({ category: e.target.value })} required />
          </label>
          <label>
            <span>Price</span>
            <input type="number" step="0.01" value={form.price} onChange={e => updateForm({ price: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Stock</span>
            <input type="number" value={form.stock} onChange={e => updateForm({ stock: Number(e.target.value) })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>Create Product</button>
      </form>

      <div className="list">
        {loading ? <p>Loading…</p> : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td><button className="danger" onClick={() => onDelete(p.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
