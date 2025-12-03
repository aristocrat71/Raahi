import { useState } from 'react';
import './TravelCard.css';

interface TravelCardProps {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  status: string;
  onDelete: (id: string) => void;
  onCardClick?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToast?: (message: string, type: 'success' | 'error') => void;
}

export default function TravelCard({
  id,
  destination,
  start_date,
  end_date,
  duration_days,
  status,
  onDelete,
  onCardClick,
  onEdit,
  onToast,
}: TravelCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(id);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/travel-cards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onDelete(id);
      } else if (response.status === 401) {
        onToast?.('Session expired. Please login again.', 'error');
        localStorage.removeItem('token');
      } else {
        onToast?.('Failed to delete trip. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="travel-card" onClick={() => onCardClick?.(id)}>
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
          <button className="card-btn edit-btn" onClick={handleEditClick}>Edit</button>
          <button 
            className="card-btn remove-btn" 
            onClick={handleRemoveClick}
            disabled={isDeleting}
          >
            {isDeleting ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <h2>Delete Trip</h2>
            <p>Are you sure you want to delete "{destination}"? This action cannot be undone.</p>
            <div className="delete-confirm-buttons">
              <button 
                className="btn-cancel" 
                onClick={handleCancelDelete}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm-delete" 
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
