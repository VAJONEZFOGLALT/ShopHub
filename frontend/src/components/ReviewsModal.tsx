import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

type Review = {
  id: number;
  rating: number;
  title: string;
  comment: string;
  userName: string;
  createdAt: string;
};

type ReviewsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  productId: number;
  productName: string;
  reviewSummary: { average: number; count: number };
  onReviewSubmitted: () => void;
  initialView?: 'list' | 'write';
};

export function ReviewsModal({
  isOpen,
  onClose,
  reviews,
  productId,
  productName,
  reviewSummary,
  onReviewSubmitted,
  initialView = 'list',
}: ReviewsModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'write'>(initialView);

  useEffect(() => {
    if (isOpen) {
      setViewMode(initialView);
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    await api.createReview({
      userId: user.id,
      productId: productId,
      rating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    });

    onReviewSubmitted();
    setReviewTitle('');
    setReviewComment('');
    setRating(5);
    setViewMode('list');
  };

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content reviews-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header reviews-modal-header">
          <div className="reviews-modal-title">
            <h2>Reviews for {productName}</h2>
            <div className="reviews-modal-summary">
              <span className="review-score-large">★ {reviewSummary.average.toFixed(1)}</span>
              <span className="review-count-text">{reviewSummary.count} reviews</span>
            </div>
          </div>
          <div className="reviews-modal-header-actions">
            <div className="reviews-modal-tabs">
              <button
                type="button"
                className={`reviews-tab ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                View Reviews
              </button>
              <button
                type="button"
                className={`reviews-tab ${viewMode === 'write' ? 'active' : ''}`}
                onClick={() => setViewMode('write')}
                disabled={!user}
                title={user ? 'Write a review' : 'Sign in to write a review'}
              >
                Write Review
              </button>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal-body reviews-modal-body">
          <div className="reviews-modal-sidebar">
            <div className="rating-distribution">
              <h3>Ratings</h3>
              {ratingDistribution.map(({ star, count, percentage }) => (
                <button
                  key={star}
                  className={`rating-filter-btn ${filterRating === star ? 'active' : ''}`}
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                >
                  <span className="rating-filter-stars">{'★'.repeat(star)}</span>
                  <div className="rating-filter-bar">
                    <div className="rating-filter-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="rating-filter-count">{count}</span>
                </button>
              ))}
              {filterRating && (
                <button className="clear-filter-btn" onClick={() => setFilterRating(null)}>
                  Clear Filter
                </button>
              )}
            </div>

            {user ? (
              <button className="btn-primary" onClick={() => setViewMode('write')}>
                ✍️ Write a Review
              </button>
            ) : (
              <div className="reviews-login-hint">Sign in to write a review.</div>
            )}
          </div>

          <div className="reviews-modal-main">
            {viewMode === 'write' && !user && (
              <div className="review-form-modal-card">
                <div className="review-form-header">
                  <h3>Write a Review</h3>
                </div>
                <p className="muted">Sign in to write a review.</p>
              </div>
            )}
            {viewMode === 'write' && user && (
              <div className="review-form-modal-card">
                <div className="review-form-header">
                  <h3>Write Your Review</h3>
                  <button className="btn-text" onClick={() => setViewMode('list')}>Cancel</button>
                </div>
                <form onSubmit={handleSubmit} className="review-form">
                  <label>
                    Rating
                    <div className="rating-selector">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`rating-btn ${rating === star ? 'active' : ''}`}
                          onClick={() => setRating(star)}
                        >
                          {'★'.repeat(star)}
                        </button>
                      ))}
                    </div>
                  </label>
                  <label>
                    Title
                    <input
                      required
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Sum up your experience"
                    />
                  </label>
                  <label>
                    Your Review
                    <textarea
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={6}
                      placeholder="Tell us what you think about this product..."
                    />
                  </label>
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              </div>
            )}

            {viewMode === 'list' && (
              <div className="reviews-modal-list">
                {filteredReviews.length === 0 ? (
                  <div className="empty-reviews">
                    <p className="muted">
                      {filterRating
                        ? `No ${filterRating}-star reviews yet.`
                        : 'No reviews yet. Be the first to review!'}
                    </p>
                    {user && (
                      <button className="btn-primary" onClick={() => setViewMode('write')}>
                        Write the First Review
                      </button>
                    )}
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const authorName = rev.userName && rev.userName.trim() ? rev.userName : 'Anonymous';
                    const authorInitial = authorName[0].toUpperCase();
                    return (
                    <div key={rev.id} className="review-card-modal">
                      <div className="review-card-header">
                        <div className="review-author">
                          <div className="review-avatar">{authorInitial}</div>
                          <div>
                            <div className="review-author-name">{authorName}</div>
                            <div className="review-rating-stars">{'★'.repeat(rev.rating)}</div>
                          </div>
                        </div>
                        <div className="review-date">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <h4 className="review-title">{rev.title}</h4>
                      <p className="review-comment">{rev.comment}</p>
                    </div>
                  );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
