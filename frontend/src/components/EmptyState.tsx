export function EmptyState({ 
  icon, 
  title, 
  message, 
  actionLabel, 
  onAction 
}: { 
  icon: string; 
  title: string; 
  message?: string; 
  actionLabel?: string; 
  onAction?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
