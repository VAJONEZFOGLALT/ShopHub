import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

export default function Layout({ children, onAuth, onCart }: { children: React.ReactNode; onAuth?: () => void; onCart?: () => void }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <div className="layout">
      <Navbar onAuth={onAuth} onCart={onCart} />
      <div className="container">{children}</div>
      <footer className="footer">© {year} {t('common.footerRights')}</footer>
    </div>
  );
}
