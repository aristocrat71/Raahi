import './PreviewModal.css';

interface Hotel {
  id: string;
  travel_card_id: string;
  hotel_name: string | null;
  location: string | null;
  check_in_date: string | null;
  check_out_date: string | null;
  room_type: string | null;
  price_per_night: number | null;
  total_cost: number | null;
}

interface Transport {
  id: string;
  travel_card_id: string;
  transport_type: string | null;
  origin: string | null;
  destination: string | null;
  departure_time: string | null;
  arrival_time: string | null;
  booking_reference: string | null;
  cost: number | null;
  is_departure: boolean;
}

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardData?: {
    id: string;
    destination: string;
    start_date: string;
    end_date: string;
    duration_days: number;
    status: string;
    hotels?: Hotel[];
    transports?: Transport[];
  };
}

export default function PreviewModal({
  isOpen,
  onClose,
  cardData,
}: PreviewModalProps) {
  if (!isOpen || !cardData) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return 'Not set';
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="preview-overlay" onClick={handleBackdropClick}>
      <div className="preview-content">
        {/* Header */}
        <div className="preview-header">
          <h2 className="preview-title">{cardData.destination}</h2>
          <button className="preview-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="preview-body">
          {/* Basic Info Section */}
          <div className="preview-section">
            <h3 className="preview-section-title">Trip Details</h3>
            <div className="preview-details">
              <div className="detail-row">
                <label className="detail-label">Status</label>
                <span className={`status-badge ${getStatusColor(cardData.status)}`}>
                  {cardData.status}
                </span>
              </div>

              <div className="detail-row">
                <label className="detail-label">Start Date</label>
                <span className="detail-value">{formatDate(cardData.start_date)}</span>
              </div>

              <div className="detail-row">
                <label className="detail-label">End Date</label>
                <span className="detail-value">{formatDate(cardData.end_date)}</span>
              </div>

              <div className="detail-row">
                <label className="detail-label">Duration</label>
                <span className="detail-value">{cardData.duration_days} days</span>
              </div>
            </div>
          </div>

          {/* Hotels Section */}
          {cardData.hotels && cardData.hotels.length > 0 && (
            <div className="preview-section">
              <h3 className="preview-section-title">Hotels</h3>
              {cardData.hotels.map((hotel, index) => (
                <div key={hotel.id} className="preview-item">
                  <h4 className="preview-item-title">Hotel {index + 1}</h4>
                  <div className="preview-details">
                    <div className="detail-row">
                      <label className="detail-label">Hotel Name</label>
                      <span className="detail-value">
                        {hotel.hotel_name || (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Location</label>
                      <span className="detail-value">
                        {hotel.location || (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Check-in Date</label>
                      <span className="detail-value">
                        {hotel.check_in_date ? (
                          formatDate(hotel.check_in_date)
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Check-out Date</label>
                      <span className="detail-value">
                        {hotel.check_out_date ? (
                          formatDate(hotel.check_out_date)
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Room Type</label>
                      <span className="detail-value">
                        {hotel.room_type || (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Price Per Night</label>
                      <span className="detail-value">
                        {hotel.price_per_night ? (
                          `$${hotel.price_per_night.toFixed(2)}`
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Total Cost</label>
                      <span className="detail-value">
                        {hotel.total_cost ? (
                          `$${hotel.total_cost.toFixed(2)}`
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Transports Section */}
          {cardData.transports && cardData.transports.length > 0 && (
            <div className="preview-section">
              <h3 className="preview-section-title">Transport</h3>
              {cardData.transports.map((transport, index) => (
                <div key={transport.id} className="preview-item">
                  <h4 className="preview-item-title">Transport {index + 1}</h4>
                  <div className="preview-details">
                    <div className="detail-row">
                      <label className="detail-label">Type</label>
                      <span className="detail-value">
                        {transport.transport_type ? (
                          <span className="transport-badge">
                            {transport.transport_type}
                          </span>
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Origin</label>
                      <span className="detail-value">
                        {transport.origin || (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Destination</label>
                      <span className="detail-value">
                        {transport.destination || (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Departure Time</label>
                      <span className="detail-value">
                        {transport.departure_time ? (
                          formatDateTime(transport.departure_time)
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Arrival Time</label>
                      <span className="detail-value">
                        {transport.arrival_time ? (
                          formatDateTime(transport.arrival_time)
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Booking Reference</label>
                      <span className="detail-value">
                        {transport.booking_reference || (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>

                    <div className="detail-row">
                      <label className="detail-label">Cost</label>
                      <span className="detail-value">
                        {transport.cost ? (
                          `$${transport.cost.toFixed(2)}`
                        ) : (
                          <span className="not-set">Not set</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="preview-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
