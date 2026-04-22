import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { formatPriceHUF } from '../utils/currency';

export default function ProductsView() {
  const { t } = useTranslation();
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
      setError(t('admin.common.requiredName'));
      return;
    }
    if (!form.category.trim()) {
      setError(t('admin.common.requiredCategory'));
      return;
    }
    if (Number(form.price) < 0) {
      setError(t('admin.common.priceNonNegative'));
      return;
    }
    if (Number(form.stock) < 0) {
      setError(t('admin.common.stockNonNegative'));
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
    const message = t('admin.common.confirmDeleteProduct', { id });
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
      setError(t('admin.common.selectImageFirst'));
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

  function FilePicker({ accept, onSelect, currentName, dimmed }: { accept?: string; onSelect: (f: File | null) => void; currentName?: string | null; dimmed?: boolean }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    return (
      <div className="file-picker">
        <input
          ref={el => { inputRef.current = el; }}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0] ?? null;
            onSelect(file);
          }}
        />
        <button type="button" className={dimmed ? 'subtle' : undefined} onClick={() => inputRef.current?.click()}>
          {t('admin.common.selectFile')}
        </button>
        <span className="filename">{currentName ?? t('admin.common.noFileSelected')}</span>
      </div>
    );
  }

  return (
    <div className="view">
      <h2>{t('admin.products')}</h2>
      {error && <div className="error">{error}</div>}
      <form className="form" onSubmit={onCreate}>
        <div className="grid">
          <label>
            <span>{t('admin.common.name')}</span>
            <input value={form.name} onChange={e => updateForm({ name: e.target.value })} required />
          </label>
          <label>
            <span>{t('admin.common.description')}</span>
            <input value={form.description} onChange={e => updateForm({ description: e.target.value })} />
          </label>
          <label>
            <span>{t('admin.common.category')}</span>
            <input value={form.category} onChange={e => updateForm({ category: e.target.value })} required />
          </label>
          <label>
            <span>{t('admin.common.price')}</span>
            <input type="number" step="0.01" value={form.price} onChange={e => updateForm({ price: Number(e.target.value) })} required />
          </label>
          <label>
            <span>{t('admin.common.stock')}</span>
            <input type="number" value={form.stock} onChange={e => updateForm({ stock: Number(e.target.value) })} required />
          </label>
        </div>
        <button type="submit" disabled={loading}>{t('admin.common.createProduct')}</button>
      </form>

      <div className="search-bar">
        <input
          type="text"
          placeholder={t('admin.common.searchByNameOrCategory')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="products-search-meta">
          {t('admin.common.showingSummary', { shown: pagedProducts.length, total: filtered.length, categories: stats.categories, outOfStock: stats.outOfStock })}
        </div>
      </div>

      <div className="list">
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>{t('admin.common.id')}</th>
                <th>{t('admin.common.image')}</th>
                <th>{t('admin.common.name')}</th>
                <th>{t('admin.common.category')}</th>
                <th>{t('admin.common.price')}</th>
                <th>{t('admin.common.stock')}</th>
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
                  <td><div className="skeleton-line" /></td>
                  <td><div className="skeleton-line" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : pagedProducts.length === 0 ? (
          <p className="muted">{t('admin.common.noProductsFound')}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>{t('admin.common.id')}</th>
                <th>{t('admin.common.image')}</th>
                <th>{t('admin.common.name')}</th>
                <th>{t('admin.common.category')}</th>
                <th>{t('admin.common.price')}</th>
                <th>{t('admin.common.stock')}</th>
                <th>{t('admin.common.actions')}</th>
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
                      <span className="muted">{t('admin.common.noImage')}</span>
                    )}
                  </td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{formatPriceHUF(Number(p.price || 0))}</td>
                  <td>{p.stock}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <FilePicker
                        accept="image/*"
                        currentName={selectedFiles[p.id]?.name ?? null}
                        dimmed={!!p.image}
                        onSelect={file => setSelectedFiles(prev => ({ ...prev, [p.id]: file }))}
                      />
                      <button
                        onClick={() => onUploadImage(p.id)}
                        disabled={!!uploading[p.id]}
                        className={p.image ? 'subtle' : undefined}
                      >
                        {uploading[p.id] ? t('admin.common.uploading') : t('admin.common.uploadImage')}
                      </button>
                      <button className="danger" onClick={() => onDelete(p.id)}>{t('admin.common.delete')}</button>
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
