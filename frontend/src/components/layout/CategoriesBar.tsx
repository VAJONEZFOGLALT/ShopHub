import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export default function CategoriesBar() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Array<{ key: string; label: string }>>([]);
  const { showToast } = useToast();
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const products = await api.getProducts(i18n.language);
        const seen: Record<string, boolean> = {};
        const list: Array<{ key: string; label: string }> = [];
        for (let i = 0; i < products.length; i += 1) {
          const cat = products[i]?.category;
          const catLabel = products[i]?.categoryLabel || cat;
          if (cat && !seen[cat]) {
            seen[cat] = true;
            list.push({ key: cat, label: catLabel });
          }
        }
        list.sort((a, b) => a.label.localeCompare(b.label));
        setCategories(list);
      } catch (e) {
        showToast('Failed to load categories', 'error');
      }
    };
    loadCategories();
  }, [i18n.language, showToast]);

  return (
    <div className="categories-bar">
      <div className="categories-bar-container">
        <Link to="/shop/all" className="categories-item" style={{ fontWeight: 600 }}>
          {t('products.allProducts')}
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.key}
            to={`/shop/category/${encodeURIComponent(cat.key)}`}
            className="categories-item"
          >
            {cat.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
