import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate('/shop');
  };
  return (
    <div className="view not-found">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Az oldal nem található.</p>
        <button onClick={handleGoHome}>Vissza a főoldalra</button>
      </div>
    </div>
  );
}
