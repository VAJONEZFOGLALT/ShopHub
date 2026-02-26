import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { useToast } from '../contexts/ToastContext';
import { ReviewsModal } from '../components/ReviewsModal';
import { ProductDetailSkeleton } from '../components/SkeletonLoader';
import { getDetailImageUrl } from '../utils/imageOptimization';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { add } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { wishlistIds, handleToggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewSummary, setReviewSummary] = useState<{ average: number; count: number }>({ average: 0, count: 0 });
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [reviewsModalView, setReviewsModalView] = useState<'list' | 'write'>('list');
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const products = await api.getProducts();
        let found: any = null;
        const targetId = Number(id);
        for (let i = 0; i < products.length; i += 1) {
          if (products[i].id === targetId) {
            found = products[i];
            break;
          }
        }
        if (!found) {
          throw new Error('Product not found');
        }
        setProduct(found);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadLists = async () => {
      if (!product) {
        return;
      }
      const summary = await api.getAverageRating(product.id);
      setReviewSummary(summary);
      const productReviews = await api.getProductReviews(product.id);
      setReviews(productReviews);

      // Only track recently viewed for authenticated users
      if (user) {
        await api.addRecentlyViewed({ userId: user.id, productId: product.id });
      }
    };
    loadLists();
  }, [product, user]);

  useEffect(() => {
    const loadLists = async () => {
      if (!user) {
        setCompareIds([]);
        return;
      }
      const compare = await api.getCompare(user.id);
      setCompareIds(compare.map((item: any) => item.productId));
    };
    loadLists();
  }, [user]);

  function handleAdd() {
    if (product) {
      const payload = { productId: product.id, name: product.name, price: Number(product.price) };
      add(payload, quantity);
      setAddedToCart(true);
      showToast(`Added ${quantity} × ${product.name} to cart`, 'success');
      setTimeout(() => setAddedToCart(false), 2000);
    }
  }

  if (loading) return (
    <div className="view product-detail">
      <ProductDetailSkeleton />
    </div>
  );
  if (error) return <div className="view"><div className="error">{error}</div></div>;
  if (!product) return <div className="view"><p>Product not found.</p></div>;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;


  const handleToggleCompare = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to compare products', 'warning');
      return;
    }

    if (compareIds.includes(product.id)) {
      await api.removeCompare(user!.id, product.id);
    } else {
      try {
        await api.addCompare({ userId: user!.id, productId: product.id });
      } catch (err: any) {
        showToast(err.message || 'Failed to add to compare', 'error');
      }
    }
    const updated = await api.getCompare(user!.id);
    setCompareIds(updated.map((item: any) => item.productId));
  };

  const handleReviewSubmitted = async () => {
    if (!product) return;
    const productReviews = await api.getProductReviews(product.id);
    setReviews(productReviews);
    const summary = await api.getAverageRating(product.id);
    setReviewSummary(summary);
  };

  const openReviewsModal = (mode: 'list' | 'write') => {
    if (mode === 'write' && !isAuthenticated) {
      showToast('Please log in to write a review', 'warning');
      return;
    }
    setReviewsModalView(mode);
    setIsReviewsModalOpen(true);
  };

  const handleBack = () => {
    const historyState = window.history.state as { idx?: number } | null;
    if (historyState && typeof historyState.idx === 'number' && historyState.idx > 0) {
      navigate(-1);
      return;
    }
    navigate('/shop');
  };

  return (
    <div className="view product-detail">
      <button onClick={handleBack}>← Back</button>
      <div className="detail-content">
        <div className="detail-left">
          <div className="detail-image-frame">
            {product.image ? (
              <img 
                src={getDetailImageUrl(product.image)} 
                alt={product.name} 
                className="detail-image"
                loading="lazy"
              />
            ) : (
              <div className="detail-image-placeholder">{product.name}</div>
            )}
            <div className="detail-media-actions">
              <button 
                type="button" 
                className={`wishlist-btn ${wishlistIds.includes(product.id) ? 'active' : ''}`} 
                onClick={() => handleToggleWishlist(product.id, product.name)}
                title={!isAuthenticated ? 'Log in to add to wishlist' : wishlistIds.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                ♥
              </button>
              <button 
                type="button" 
                className={`compare-action ${compareIds.includes(product.id) ? 'active' : ''}`} 
                onClick={handleToggleCompare}
                title={!isAuthenticated ? 'Log in to compare products' : compareIds.includes(product.id) ? 'Remove from compare' : 'Add to compare'}
              >
                {compareIds.includes(product.id) ? 'Compared' : 'Compare'}
              </button>
            </div>
          </div>
        </div>
        <div className="detail-right">
          <h1>{product.name}</h1>
          <div className="detail-meta">
            <span className="category">Category: {product.category}</span>
            <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? `In stock: ${product.stock}` : 'Out of stock'}
            </span>
            {isLowStock && <span className="stock low-stock">Low stock</span>}
          </div>
          <div className="review-summary">
            <span className="review-score">★ {reviewSummary.average.toFixed(1)}</span>
            <span className="review-count">{reviewSummary.count} reviews</span>
          </div>
          <p className="description">{product.description || 'No description available.'}</p>
          <div className="detail-highlights">
            <div className="highlight-item">
              <span className="highlight-label">Shipping</span>
              <span className="highlight-value">2-4 business days</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Returns</span>
              <span className="highlight-value">30-day returns</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Warranty</span>
              <span className="highlight-value">12 months</span>
            </div>
          </div>
          <div className="detail-footer">
            <div className="price-large">${Number(product.price).toFixed(2)}</div>
            <div className="qty-selector">
              <label>Quantity:</label>
              <input
                type="number"
                min={1}
                max={product.stock || 999}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                disabled={isOutOfStock}
              />
            </div>
            <button 
              onClick={handleAdd} 
              className={`btn-primary ${addedToCart ? 'success' : ''}`} 
              disabled={isOutOfStock}
              style={{
                transition: 'all 0.3s ease',
                backgroundColor: addedToCart ? 'var(--success)' : '',
              }}
            >
              {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <div className="detail-reviews">
        <div className="reviews-header">
          <div>
            <h2>Customer Reviews</h2>
            <div className="review-summary-inline">
              <span className="review-score">★ {reviewSummary.average.toFixed(1)}</span>
              <span className="review-count">{reviewSummary.count} reviews</span>
            </div>
          </div>
          <div className="reviews-header-actions">
            <button 
              className="btn-secondary" 
              onClick={() => openReviewsModal('write')}
              title={!isAuthenticated ? 'Log in to write a review' : 'Write a review'}
            >
              ✍️ Write a Review
            </button>
          </div>
        </div>
        <div className="reviews-preview">
          {reviews.length === 0 ? (
            <div className="empty-reviews-preview">
              <p className="muted">No reviews yet. Be the first to review!</p>
              <button 
                className="btn-primary" 
                onClick={() => openReviewsModal('write')}
                title={!isAuthenticated ? 'Log in to write a review' : 'Write a review'}
              >
                Write the First Review
              </button>
            </div>
          ) : (
            <>
              <div className="reviews-preview-list">
                {reviews.slice(0, 3).map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-top">
                      <strong>{rev.title}</strong>
                      <span className="review-rating">★ {rev.rating}</span>
                    </div>
                    <p className="review-comment-preview">{rev.comment}</p>
                    <div className="review-meta">by {rev.userName}</div>
                  </div>
                ))}
              </div>
              {reviews.length > 3 && (
                <button 
                  className="btn-secondary view-more-reviews-btn" 
                  onClick={() => openReviewsModal('list')}
                >
                  View All {reviewSummary.count} Reviews
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        reviews={reviews}
        productId={product.id}
        productName={product.name}
        reviewSummary={reviewSummary}
        onReviewSubmitted={handleReviewSubmitted}
        initialView={reviewsModalView}
      />

    </div>
  );
}
