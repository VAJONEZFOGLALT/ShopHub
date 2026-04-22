import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../api';

export default function CategoriesBar() {
  const [categories, setCategories] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const products = await api.getProducts();
        const seen: Record<string, boolean> = {};
        const list: string[] = [];
        for (let i = 0; i < products.length; i += 1) {
          const cat = products[i]?.category;
          if (cat && !seen[cat]) {
            seen[cat] = true;
            list.push(cat);
          }
        }
        list.sort();
        setCategories(list);
      } catch (e) {
        console.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  // Don't show categories bar on category pages
  if (location.pathname.startsWith('/shop/category')) {
    return null;
  }

  return (
    <div className="categories-bar">
      <div className="categories-bar-container">
        <Link to="/shop/all" className="categories-item" style={{ fontWeight: 600 }}>
          All Products
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            to={`/shop/category/${encodeURIComponent(cat)}`}
            className="categories-item"
          >
            {cat}
          </Link>
        ))}
      </div>
    </div>
  );
}
