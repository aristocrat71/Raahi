import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TravelCard from '../components/TravelCard';
import Button from '../components/Button';
import './Dashboard.css';

interface TravelCard {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: string;
}

export default function Dashboard() {
  const [firstName, setFirstName] = useState('');
  const [travelCards, setTravelCards] = useState<TravelCard[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fullName = localStorage.getItem('full_name');

    if (!token) {
      navigate('/login');
      return;
    }

    if (fullName) {
      const first = fullName.split(' ')[0];
      setFirstName(first);
    }

    fetchTravelCards(token);
  }, [navigate]);

  const fetchTravelCards = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/travel-cards', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTravelCards(data);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching travel cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('email');
      localStorage.removeItem('full_name');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <>
        <Header showSettings showLogout onLogout={handleLogout} />
        <div className="dashboard">
          <p>Loading your trips...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showSettings showLogout onLogout={handleLogout} />
      <div className="dashboard">
        <div className="dashboard-greeting">
          <h1>Hey {firstName}, ready to spread your wings?</h1>
        </div>

        <div className="dashboard-content">
          {travelCards.length === 0 ? (
            <div className="empty-state">
              <p>No trips yet. Click the "Add Trip" button to create your first adventure!</p>
            </div>
          ) : (
            <div className="cards-grid">
              {travelCards.map((card) => (
                <TravelCard
                  key={card.id}
                  id={card.id}
                  destination={card.destination}
                  start_date={card.start_date}
                  end_date={card.end_date}
                  duration_days={card.duration_days}
                  status={card.status}
                />
              ))}
            </div>
          )}
        </div>

        <button className="add-trip-btn">
          <span>+ Add Trip</span>
        </button>
      </div>
    </>
  );
}
