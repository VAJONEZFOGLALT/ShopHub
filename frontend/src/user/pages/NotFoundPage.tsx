import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/');
  };
  return (
    <div className="view not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Page not found.</p>
        <button onClick={handleGoHome}>Go Home</button>
      </div>
    </div>
  );
}
