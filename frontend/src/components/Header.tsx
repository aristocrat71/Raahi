import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  showSettings?: boolean;
  showLogout?: boolean;
  onLogout?: () => void;
}

export default function Header({
  showSettings = false,
  showLogout = false,
  onLogout,
}: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          Raahi
        </Link>

        <nav className="nav">
          {showSettings && (
            <button className="settings-btn" title="Settings">
              <img src="/settings_icon.png" alt="Settings" />
            </button>
          )}
          {showLogout && (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
