import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">Welcome to Raahi</h1>
          <p className="home-subtitle">
            Plan your perfect trip with ease. Organize destinations, hotels, and transport in one place.
          </p>
          
          <div className="home-buttons">
            <Link to="/login">
              <Button variant="primary">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary">Register</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
