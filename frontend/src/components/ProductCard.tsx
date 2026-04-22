import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { getProductImageUrl } from '../utils/imageOptimization';

type ProductCardProps = {
  product: any;
  disableNav?: boolean;
  showWishlist?: boolean;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: number, productName?: string) => void;
  isWishlistPending?: boolean;
  showCompare?: boolean;
  isCompared?: boolean;
  onToggleCompare?: (product: any) => void;
  isComparePending?: boolean;
  showStockBadge?: boolean;
};

function ProductCard({
  product,
  disableNav,
  showWishlist,
  isWishlisted,
  onToggleWishlist,
  isWishlistPending,
  showCompare,
  isCompared,
  onToggleCompare,
  isComparePending,
  showStockBadge,
}: ProductCardProps) {
  const { t } = useTranslation();
  const { add } = useCart();
  const navigate = useNavigate();

  const canNavigate = !disableNav;

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('[data-card-control="true"]')) {
      return;
    }

    if (canNavigate) {
      navigate(`/shop/product/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const payload = { productId: product.id, name: product.name, price: Number(product.price) };
    add(payload, 1);
  };

  const cursorStyle = canNavigate ? 'pointer' : 'default';
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="card product-card" onClick={handleOpen} style={{ cursor: cursorStyle }}>
      <div className="product-media">
        {product.image ? (
          <img 
            src={getProductImageUrl(product.image)} 
            alt={product.name} 
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="product-image-placeholder">{product.name}</div>
        )}
        {showStockBadge && (
          <span className={`stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}`}>
            {isOutOfStock ? t('products.outOfStock') : isLowStock ? t('products.lowStock') : t('products.inStock')}
          </span>
        )}
        {showWishlist && (
          <button
            type="button"
            data-card-control="true"
            className={`wishlist-btn ${isWishlisted ? 'active' : ''} ${isWishlistPending ? 'is-loading' : ''}`.trim()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product.id, product.name); }}
            title={isWishlisted ? t('products.removeFromWishlist') : t('products.addToWishlist')}
            aria-disabled={isWishlistPending}
          >
            ♥
          </button>
        )}
        {showCompare && (
          <button
            type="button"
            data-card-control="true"
            className={`compare-toggle ${isCompared ? 'active' : ''} ${isComparePending ? 'is-loading' : ''}`.trim()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onToggleCompare?.(product); }}
            aria-disabled={isComparePending}
          >
            <span className="compare-toggle-check" aria-hidden="true">
              {isCompared ? '✓' : ''}
            </span>
            {t('products.compare')}
          </button>
        )}
      </div>
      <div className="product-header">
        <h3>{product.name}</h3>
        <span className="product-category">{product.categoryLabel || product.category}</span>
      </div>
      <div className="product-body">
        <div className="price">{Number(product.price).toFixed(2)}</div>
        {typeof product.stock === 'number' && <div className="stock">{isOutOfStock ? t('products.outOfStock') : `${t('products.stock')}: ${product.stock}`}</div>}
      </div>
      <div className="product-actions">
        <button data-card-control="true" onClick={handleAddToCart} disabled={isOutOfStock}>{t('products.addToCart')}</button>
      </div>
    </div>
  );
}

export default memo(ProductCard, (prev, next) => {
  return (
    prev.product?.id === next.product?.id &&
    prev.product?.name === next.product?.name &&
    prev.product?.price === next.product?.price &&
    prev.product?.stock === next.product?.stock &&
    prev.product?.category === next.product?.category &&
    prev.product?.image === next.product?.image &&
    prev.disableNav === next.disableNav &&
    prev.showWishlist === next.showWishlist &&
    prev.isWishlisted === next.isWishlisted &&
    prev.showCompare === next.showCompare &&
    prev.isCompared === next.isCompared &&
    prev.showStockBadge === next.showStockBadge
  );
});
