import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getThumbnailUrl } from '../utils/imageOptimization';

export default function CompareDrawer({
  items,
  onRemove,
  onClear,
}: {
  items: any[];
  onRemove: (id: number) => void;
  onClear: () => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener('open-compare-drawer', openHandler);
    return () => {
      window.removeEventListener('open-compare-drawer', openHandler);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`compare-drawer ${open ? 'open' : ''}`}>
        <div className="compare-drawer-header">
          <div>
            <strong>{t('products.compare')}</strong>
            <span>{items.length} kivalasztva</span>
          </div>
          <button type="button" className="modal-close" onClick={() => setOpen(false)}>×</button>
        </div>
        <div className="compare-drawer-body">
          {items.map((item) => (
            <div key={item.id} className="compare-drawer-item">
              {item.image ? (
                <img src={getThumbnailUrl(item.image)} alt={item.name} className="compare-item-image" loading="lazy" />
              ) : (
                <div className="compare-item-image-placeholder">Nincs kep</div>
              )}
              <div className="compare-item-info">
                <span className="compare-item-name" title={item.name}>{item.name}</span>
                <div className="compare-item-meta">
                  <span className="compare-item-price">${Number(item.price).toFixed(2)}</span>
                  <span className="compare-item-category">{item.category || '—'}</span>
                </div>
              </div>
              <button type="button" onClick={() => onRemove(item.id)} title={t('cart.remove')}>
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="compare-drawer-actions">
          <button type="button" className="btn-secondary" onClick={onClear}>Torles</button>
          <button type="button" className="btn-primary" onClick={() => setShowTable(true)} disabled={items.length < 2}>{t('products.compare')}</button>
        </div>
      </div>
      {open && <div className="compare-overlay" onClick={() => setOpen(false)} />}
      {showTable && (
        <div className="modal-overlay" onClick={() => setShowTable(false)}>
          <div className="modal-content compare-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Termek osszehasonlitas</h2>
              <button className="modal-close" onClick={() => setShowTable(false)}>×</button>
            </div>
            <div className="modal-body">
              {items.length < 2 ? (
                <p>Valassz legalabb ket termeket az osszehasonlitashoz.</p>
              ) : (
                <div className="compare-table">
                  <div className="compare-row compare-head">
                    <div className="compare-cell">Jellemzo</div>
                    {items.map((item) => (
                      <div key={item.id} className="compare-cell">{item.name}</div>
                    ))}
                  </div>
                  <div className="compare-row">
                    <div className="compare-cell">{t('products.price')}</div>
                    {items.map((item) => (
                      <div key={item.id} className="compare-cell">${Number(item.price).toFixed(2)}</div>
                    ))}
                  </div>
                  <div className="compare-row">
                    <div className="compare-cell">{t('products.stock')}</div>
                    {items.map((item) => (
                      <div key={item.id} className="compare-cell">{item.stock ?? '—'}</div>
                    ))}
                  </div>
                  <div className="compare-row">
                    <div className="compare-cell">{t('products.category')}</div>
                    {items.map((item) => (
                      <div key={item.id} className="compare-cell">{item.category}</div>
                    ))}
                  </div>
                  <div className="compare-row">
                    <div className="compare-cell">Leiras</div>
                    {items.map((item) => (
                      <div key={item.id} className="compare-cell">{item.description || '—'}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
