import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPriceHUF } from '../utils/currency';

export default function CompareBar({
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

  const canCompare = items.length >= 2;
  const summary = useMemo(() => {
    if (items.length === 0) {
      return t('compare.selectProducts');
    }
    return t('compare.selectedCount', { count: items.length });
  }, [items.length, t]);

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <div className="compare-bar">
        <div className="compare-summary">
          <strong>{t('products.compare')}</strong>
          <span>{summary}</span>
        </div>
        <div className="compare-items">
          {items.map((item) => (
            <div key={item.id} className="compare-chip">
              <span title={item.name}>{item.name}</span>
              <button type="button" onClick={() => onRemove(item.id)}>×</button>
            </div>
          ))}
        </div>
        <div className="compare-actions">
          <button type="button" className="btn-secondary" onClick={onClear}>{t('compare.clear')}</button>
          <button type="button" className="btn-primary" onClick={() => setOpen(true)} disabled={!canCompare}>{t('products.compare')}</button>
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-content compare-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('compare.productComparison')}</h2>
              <button className="modal-close" onClick={() => setOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              {items.length < 2 ? (
                <p>{t('compare.selectAtLeastTwo')}</p>
              ) : (
                <div className="compare-table">
                  <div className="compare-row compare-head">
                    <div className="compare-cell">{t('compare.feature')}</div>
                    {items.map((item) => (
                      <div key={item.id} className="compare-cell">{item.name}</div>
                    ))}
                  </div>
                  <div className="compare-row">
                    <div className="compare-cell">{t('products.price')}</div>
                    {items.map((item) => (
                      <div key={item.id} className="compare-cell">{formatPriceHUF(Number(item.price))}</div>
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
                    <div className="compare-cell">{t('compare.description')}</div>
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
