export function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-content">
        <div className="skeleton-title" />
        <div className="skeleton-text" />
        <div className="skeleton-price" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="detail-layout">
      <div className="detail-image-section">
        <div className="skeleton-image-large" />
      </div>
      <div className="detail-info-section">
        <div className="skeleton-title-large" />
        <div className="skeleton-text" />
        <div className="skeleton-text" />
        <div className="skeleton-price-large" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
}

export function Spinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return <div className={`spinner spinner-${size}`} />;
}
