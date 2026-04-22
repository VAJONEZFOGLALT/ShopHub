import Navbar from './Navbar';
import { LanguageSwitcher } from '../LanguageSwitcher';

export default function Layout({ children, onAuth, onCart }: { children: React.ReactNode; onAuth?: () => void; onCart?: () => void }) {
  const year = new Date().getFullYear();
  return (
    <div className="layout">
      <Navbar onAuth={onAuth} onCart={onCart} />
      <div className="container">{children}</div>
      <LanguageSwitcher />
      <footer className="footer">© {year} Professional Shop. All rights reserved.</footer>
    </div>
  );
}
