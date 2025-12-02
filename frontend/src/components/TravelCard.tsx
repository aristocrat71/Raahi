import './TravelCard.css';

interface TravelCardProps {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: string;
}

export default function TravelCard({
  id,
  destination,
  start_date,
  end_date,
  duration_days,
  status,
}: TravelCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'status-planning';
      case 'booked':
        return 'status-booked';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-planning';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="travel-card">
      <div className="card-header">
        <h3 className="card-destination">{destination}</h3>
        <span className={`status-badge ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>

      <div className="card-content">
        <div className="card-dates">
          <img src="/calender.png" alt="Calendar" className="date-icon" />
          <p className="date-value">
            {formatDate(start_date)} - {formatDate(end_date)}
          </p>
        </div>
        <div className="card-duration">
          <p className="duration-label">Duration</p>
          <p className="duration-value">{duration_days} days</p>
        </div>
      </div>

      <div className="card-actions">
        <button className="card-btn edit-btn">Edit</button>
        <button className="card-btn remove-btn">Remove</button>
      </div>
    </div>
  );
}
