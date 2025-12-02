import { useState } from 'react';
import './AddTaskModal.css';

interface Hotel {
  id?: string;
  name: string;
  location: string;
  check_in_date: string;
  check_out_date: string;
  room_type: string;
  price_per_night: string;
  total_cost: string;
}

interface Transport {
  id?: string;
  type: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  booking_reference: string;
  cost: string;
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrip: (data: {
    destination: string;
    start_date: string;
    end_date: string;
    status: string;
    hotels: Hotel[];
    transports: Transport[];
  }) => Promise<void>;
  onStatusChange: (status: string) => void;
  defaultStatus: string;
}

type TabType = 'basic' | 'hotels' | 'transport';

export default function AddTaskModal({
  isOpen,
  onClose,
  onAddTrip,
  onStatusChange,
  defaultStatus,
}: AddTaskModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [loading, setLoading] = useState(false);

  // Basic Info
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState(defaultStatus);

  // Hotels
  const [hotels, setHotels] = useState<Hotel[]>([
    {
      id: '0',
      name: '',
      location: '',
      check_in_date: '',
      check_out_date: '',
      room_type: '',
      price_per_night: '',
      total_cost: '',
    },
  ]);

  // Transports
  const [transports, setTransports] = useState<Transport[]>([
    {
      id: '0',
      type: '',
      origin: '',
      destination: '',
      departure_time: '',
      arrival_time: '',
      booking_reference: '',
      cost: '',
    },
  ]);

  const handleAddHotel = () => {
    setHotels([
      ...hotels,
      {
        id: Date.now().toString(),
        name: '',
        location: '',
        check_in_date: '',
        check_out_date: '',
        room_type: '',
        price_per_night: '',
        total_cost: '',
      },
    ]);
  };

  const handleRemoveHotel = (index: number) => {
    setHotels(hotels.filter((_, i) => i !== index));
  };

  const handleHotelChange = (
    index: number,
    field: keyof Hotel,
    value: string
  ) => {
    const updatedHotels = [...hotels];
    updatedHotels[index][field] = value;
    setHotels(updatedHotels);
  };

  const handleAddTransport = () => {
    setTransports([
      ...transports,
      {
        id: Date.now().toString(),
        type: '',
        origin: '',
        destination: '',
        departure_time: '',
        arrival_time: '',
        booking_reference: '',
        cost: '',
      },
    ]);
  };

  const handleRemoveTransport = (index: number) => {
    setTransports(transports.filter((_, i) => i !== index));
  };

  const handleTransportChange = (
    index: number,
    field: keyof Transport,
    value: string
  ) => {
    const updatedTransports = [...transports];
    updatedTransports[index][field] = value;
    setTransports(updatedTransports);
  };

  const validateBasicInfo = () => {
    return destination.trim() && startDate && endDate;
  };

  const handleNext = () => {
    if (activeTab === 'basic' && validateBasicInfo()) {
      setActiveTab('hotels');
    } else if (activeTab === 'hotels') {
      setActiveTab('transport');
    }
  };

  const handleSkip = () => {
    if (activeTab === 'hotels') {
      setHotels([]);
      setActiveTab('transport');
    } else if (activeTab === 'transport') {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (activeTab === 'hotels') {
      setActiveTab('basic');
    } else if (activeTab === 'transport') {
      setActiveTab('hotels');
    }
  };

  const handleSubmit = async () => {
    if (!validateBasicInfo()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Filter out empty hotel entries
      const filledHotels = hotels.filter(
        (h) =>
          h.name.trim() ||
          h.location.trim() ||
          h.check_in_date ||
          h.check_out_date ||
          h.room_type.trim() ||
          h.price_per_night.trim() ||
          h.total_cost.trim()
      );

      // Filter out empty transport entries
      const filledTransports = transports.filter(
        (t) =>
          t.type.trim() ||
          t.origin.trim() ||
          t.destination.trim() ||
          t.departure_time ||
          t.arrival_time ||
          t.booking_reference.trim() ||
          t.cost.trim()
      );

      await onAddTrip({
        destination,
        start_date: startDate,
        end_date: endDate,
        status,
        hotels: filledHotels,
        transports: filledTransports,
      });

      // Reset form (except status - keep user's selection)
      setDestination('');
      setStartDate('');
      setEndDate('');
      setHotels([
        {
          id: '0',
          name: '',
          location: '',
          check_in_date: '',
          check_out_date: '',
          room_type: '',
          price_per_night: '',
          total_cost: '',
        },
      ]);
      setTransports([
        {
          id: '0',
          type: '',
          origin: '',
          destination: '',
          departure_time: '',
          arrival_time: '',
          booking_reference: '',
          cost: '',
        },
      ]);
      setActiveTab('basic');
      onClose();
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header with Close Button */}
        <div className="modal-header">
          <h2 className="modal-title">Create New Trip</h2>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            className={`tab ${activeTab === 'hotels' ? 'active' : ''}`}
            onClick={() => setActiveTab('hotels')}
          >
            Hotels
          </button>
          <button
            className={`tab ${activeTab === 'transport' ? 'active' : ''}`}
            onClick={() => setActiveTab('transport')}
          >
            Transport
          </button>
        </div>

        {/* Tab Content */}
        <div className="modal-body">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="form-group">
                <label className="form-label">
                  Destination <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Start Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    End Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Status <span className="required">*</span>
                </label>
                <select
                  className="form-input"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    onStatusChange(e.target.value);
                  }}
                >
                  <option value="planning">Planning</option>
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          )}

          {/* Hotels Tab */}
          {activeTab === 'hotels' && (
            <div className="tab-content">
              {hotels.map((hotel, index) => (
                <div key={hotel.id} className="form-section">
                  <div className="section-header">
                    <h3>Hotel {index + 1}</h3>
                    {hotels.length > 1 && (
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveHotel(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hotel Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter hotel name"
                      value={hotel.name}
                      onChange={(e) =>
                        handleHotelChange(index, 'name', e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Enter location"
                      value={hotel.location}
                      onChange={(e) =>
                        handleHotelChange(index, 'location', e.target.value)
                      }
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Check-in Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={hotel.check_in_date}
                        onChange={(e) =>
                          handleHotelChange(
                            index,
                            'check_in_date',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Check-out Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={hotel.check_out_date}
                        onChange={(e) =>
                          handleHotelChange(
                            index,
                            'check_out_date',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Room Type</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Deluxe, Suite, Standard"
                      value={hotel.room_type}
                      onChange={(e) =>
                        handleHotelChange(index, 'room_type', e.target.value)
                      }
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Price Per Night</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="0"
                        value={hotel.price_per_night}
                        onChange={(e) =>
                          handleHotelChange(
                            index,
                            'price_per_night',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Total Cost</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="0"
                        value={hotel.total_cost}
                        onChange={(e) =>
                          handleHotelChange(index, 'total_cost', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="add-item-btn"
                onClick={handleAddHotel}
              >
                + Add Hotel
              </button>
            </div>
          )}

          {/* Transport Tab */}
          {activeTab === 'transport' && (
            <div className="tab-content">
              {transports.map((transport, index) => (
                <div key={transport.id} className="form-section">
                  <div className="section-header">
                    <h3>Transport {index + 1}</h3>
                    {transports.length > 1 && (
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveTransport(index)}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Transport Type</label>
                    <select
                      className="form-input"
                      value={transport.type}
                      onChange={(e) =>
                        handleTransportChange(index, 'type', e.target.value)
                      }
                    >
                      <option value="">Select type</option>
                      <option value="flight">Flight</option>
                      <option value="train">Train</option>
                      <option value="bus">Bus</option>
                      <option value="car">Car</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Origin</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Starting location"
                        value={transport.origin}
                        onChange={(e) =>
                          handleTransportChange(index, 'origin', e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Destination</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="End location"
                        value={transport.destination}
                        onChange={(e) =>
                          handleTransportChange(
                            index,
                            'destination',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Departure Time</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={transport.departure_time}
                        onChange={(e) =>
                          handleTransportChange(
                            index,
                            'departure_time',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Arrival Time</label>
                      <input
                        type="datetime-local"
                        className="form-input"
                        value={transport.arrival_time}
                        onChange={(e) =>
                          handleTransportChange(
                            index,
                            'arrival_time',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Booking Reference</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g., PNR or Confirmation number"
                        value={transport.booking_reference}
                        onChange={(e) =>
                          handleTransportChange(
                            index,
                            'booking_reference',
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cost</label>
                      <input
                        type="number"
                        className="form-input"
                        placeholder="0"
                        value={transport.cost}
                        onChange={(e) =>
                          handleTransportChange(index, 'cost', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="add-item-btn"
                onClick={handleAddTransport}
              >
                + Add Transport
              </button>
            </div>
          )}
        </div>

        {/* Footer with Buttons */}
        <div className="modal-footer">
          {activeTab === 'basic' && (
            <>
              <button className="btn-secondary" onClick={onClose}>
                Close
              </button>
              <button
                className="btn-primary"
                onClick={handleNext}
                disabled={!validateBasicInfo()}
              >
                Next
              </button>
            </>
          )}

          {activeTab === 'hotels' && (
            <>
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
              <div className="button-group">
                <button
                  className="btn-secondary"
                  onClick={handleSkip}
                >
                  Skip
                </button>
                <button
                  className="btn-primary"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {activeTab === 'transport' && (
            <>
              <button className="btn-secondary" onClick={handleBack}>
                Back
              </button>
              <div className="button-group">
                <button
                  className="btn-secondary"
                  onClick={handleSkip}
                >
                  Skip
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
