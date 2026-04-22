import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { ADMIN_UI, formatPageLabel } from './adminUiText';

export default function ProductsView() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<number, File | null>>({});
  const [uploading, setUploading] = useState<Record<number, boolean>>({});

  const [form, setForm] = useState({ name: '', description: '', category: '', price: 0, stock: 0 });
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
      const data = await api.getProducts();
      setProducts(data);
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
    if (!form.name.trim()) {
      setError('A név megadása kötelező');
      return;
    }
    if (!form.category.trim()) {
      setError('A kategória megadása kötelező');
      return;
    }
    if (Number(form.price) < 0) {
      setError('Az ár nem lehet negatív');
      return;
    }
    if (Number(form.stock) < 0) {
      setError('A készlet nem lehet negatív');
      return;
    }
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
    const message = 'Biztosan törlöd a terméket? #' + id;
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

  const trimmed = query.trim().toLowerCase();
  const filtered = trimmed
    ? products.filter((p: any) =>
        String(p.name || '').toLowerCase().includes(trimmed) ||
        String(p.category || '').toLowerCase().includes(trimmed)
      )
    : products;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagedProducts = filtered.slice(start, start + pageSize);

  const stats = useMemo(() => {
    let lowStock = 0;
    let outOfStock = 0;
    let inventoryValue = 0;
    const categories = new Set<string>();

    for (let i = 0; i < products.length; i += 1) {
      const product = products[i];
      const stock = Number(product.stock) || 0;
      const price = Number(product.price) || 0;

      if (product.category) {
        categories.add(String(product.category));
      }
      if (stock <= 0) {
        outOfStock += 1;
      } else if (stock <= 5) {
        lowStock += 1;
      }
      inventoryValue += stock * price;
    }

    return {
      total: products.length,
      filtered: filtered.length,
      categories: categories.size,
      lowStock,
      outOfStock,
      inventoryValue,
    };
  }, [products, filtered.length]);

  async function onUploadImage(id: number) {
    const file = selectedFiles[id];
    if (!file) {
      setError('Előbb válassz ki egy képet');
      return;
    }
    setError(null);
    setUploading(prev => ({ ...prev, [id]: true }));
    try {
      await api.uploadProductImage(id, file);
      setSelectedFiles(prev => ({ ...prev, [id]: null }));
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(prev => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="view">
      <h2>Termékek</h2>
      <div className="stats-grid products-stats">
        <div className="stat-item">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Összes termék</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🔎</div>
          <div className="stat-info">
            <div className="stat-value">{stats.filtered}</div>
            <div className="stat-label">Szűrésnek megfelelő</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <div className="stat-value">{stats.lowStock + stats.outOfStock}</div>
            <div className="stat-label">Figyelmet igényel</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">${stats.inventoryValue.toFixed(0)}</div>
            <div className="stat-label">Készletérték</div>
          </div>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>Név</span>
            <input value={form.name} onChange={e => updateForm({ name: e.target.value })} required />
          </label>
          <label>
            <span>Leírás</span>
            <input value={form.description} onChange={e => updateForm({ description: e.target.value })} />
          </label>
          <label>
            <span>Kategória</span>
            <input value={form.category} onChange={e => updateForm({ category: e.target.value })} required />
          </label>
          <label>
            <span>Ár</span>
            <input type="number" step="0.01" value={form.price} onChange={e => updateForm({ price: Number(e.target.value) })} required />
          </label>
          <label>
            <span>Készlet</span>
            <input type="number" value={form.stock} onChange={e => updateForm({ stock: Number(e.target.value) })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>Termék létrehozása</button>
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Keresés név vagy kategória alapján"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="products-search-meta">
          {pagedProducts.length} / {filtered.length} tétel • {stats.categories} kategória • {stats.outOfStock} nincs készleten
        </div>
      </div>

      <div className="list">
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kép</th>
                <th>Név</th>
                <th>Kategória</th>
                <th>Ár</th>
                <th>Készlet</th>
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
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : pagedProducts.length === 0 ? (
          <p className="muted">{ADMIN_UI.empty}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kép</th>
                <th>Név</th>
                <th>Kategória</th>
                <th>Ár</th>
                <th>Készlet</th>
                <th>{ADMIN_UI.actions}</th>
              </tr>
            </thead>
            <tbody>
              {pagedProducts.map((p: any) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <span className="muted">Nincs kép</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0] ?? null;
                          setSelectedFiles(prev => ({ ...prev, [p.id]: file }));
                        }}
                      />
                      <button
                        onClick={() => onUploadImage(p.id)}
                        disabled={!!uploading[p.id]}
                      >
                        {uploading[p.id] ? 'Feltöltés...' : 'Kép feltöltése'}
                      </button>
                      <button className="danger" onClick={() => onDelete(p.id)}>Törlés</button>
                    </div>
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
