import Navbar from './Navbar';

type AuthModal = 'none' | 'login' | 'register'

export default function Layout({ children, onOpenAuth, onOpenCart }: { children: React.ReactNode; onOpenAuth?: (modal: AuthModal) => void; onOpenCart?: () => void }) {
  const year = new Date().getFullYear();
  return (
    <div className="layout">
      <Navbar onOpenAuth={onOpenAuth} onOpenCart={onOpenCart} />
      <div className="container">
        {children}
      </div>
      <footer className="footer">© {year} Professional Shop. All rights reserved.</footer>
    </div>
  );
}
