import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TravelCard from '../components/TravelCard';
import AddTaskModal from '../components/AddTaskModal';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('planning');
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

  const handleAddTrip = async (data: {
    destination: string;
    start_date: string;
    end_date: string;
    status: string;
    hotels: {
      hotel_name: string | null;
      location: string | null;
      check_in_date: string | null;
      check_out_date: string | null;
      room_type: string | null;
      price_per_night: number | null;
      total_cost: number | null;
    }[];
    transports: {
      transport_type: string | null;
      origin: string | null;
      destination: string | null;
      departure_time: string | null;
      arrival_time: string | null;
      booking_reference: string | null;
      cost: number | null;
    }[];
  }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    try {
      // Build request payload
      const payload: any = {
        destination: data.destination,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
      };

      // Only add hotels if there are any
      if (data.hotels.length > 0) {
        payload.hotels = data.hotels;
      }

      // Only add transports if there are any
      if (data.transports.length > 0) {
        payload.transports = data.transports;
      }

      const response = await fetch('http://localhost:8000/api/travel-cards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newCard = await response.json();
        setTravelCards([...travelCards, newCard]);
        alert('Trip created successfully!');
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
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
                  onDelete={(id) =>
                    setTravelCards(travelCards.filter((c) => c.id !== id))
                  }
                />
              ))}
            </div>
          )}
        </div>

        <button className="add-trip-btn" onClick={() => setIsModalOpen(true)}>
          <span>+ Add Trip</span>
        </button>

        <AddTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTrip={handleAddTrip}
          onStatusChange={setDefaultStatus}
          defaultStatus={defaultStatus}
        />
      </div>
    </>
  );
}
