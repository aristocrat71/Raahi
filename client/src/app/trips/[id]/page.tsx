"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { useTripService } from '@/services/tripService';
import { Trip, TripItem } from '@/types/trip';
import Button from '@/components/ui/Button';
import styles from './trip.module.css';

interface TripPageProps {
  params: {
    id: string;
  };
}

export default function TripPage({ params }: TripPageProps) {
  const tripId = params.id;
  const { user, loading } = useAuth();
  const router = useRouter();
  const tripService = useTripService();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [tripItems, setTripItems] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user && tripId) {
      loadTripData();
    }
  }, [user, tripId]);
  
  const loadTripData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch trip details and items
      const tripData = await tripService.getTripById(tripId);
      setTrip(tripData);
      
      const itemsData = await tripService.getTripItems(tripId);
      setTripItems(itemsData);
    } catch (err) {
      console.error('Error loading trip data:', err);
      setError('Failed to load trip details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditTrip = () => {
    router.push(`/trips/${tripId}/edit`);
  };
  
  const handleDeleteTrip = async () => {
    if (confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      try {
        await tripService.deleteTrip(tripId);
        router.push('/trips');
      } catch (err) {
        console.error('Error deleting trip:', err);
        setError('Failed to delete trip. Please try again.');
      }
    }
  };
  
  const handleAddItem = () => {
    router.push(`/trips/${tripId}/items/add`);
  };
  
  // Format date range for display
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };
  
  // Group trip items by type
  const groupedItems = tripItems.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, TripItem[]>);
  
  if (loading || isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading trip details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
        <Button onClick={loadTripData}>Try Again</Button>
      </div>
    );
  }
  
  if (!trip) {
    return (
      <div className={styles.errorContainer}>
        <h2>Trip Not Found</h2>
        <p>The trip you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button onClick={() => router.push('/trips')}>Back to My Trips</Button>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.tripHeader}>
        <div className={styles.tripHeaderInfo}>
          <h1>{trip.title}</h1>
          <p className={styles.tripDates}>
            {formatDateRange(trip.start_date, trip.end_date)}
          </p>
          <p className={styles.tripLocation}>{trip.location}</p>
        </div>
        
        <div className={styles.tripActions}>
          <Button variant="outline" onClick={handleEditTrip}>Edit Trip</Button>
          <Button variant="secondary" onClick={handleDeleteTrip}>Delete Trip</Button>
        </div>
      </div>
      
      {trip.description && (
        <div className={styles.tripDescription}>
          <p>{trip.description}</p>
        </div>
      )}
      
      <div className={styles.itemsSection}>
        <div className={styles.itemsHeader}>
          <h2>Trip Items</h2>
          <Button onClick={handleAddItem}>Add Item</Button>
        </div>
        
        {tripItems.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No items added to this trip yet.</p>
            <Button onClick={handleAddItem}>Add Your First Item</Button>
          </div>
        ) : (
          <div className={styles.itemsContainer}>
            {/* Accommodations */}
            {groupedItems.accommodation && (
              <div className={styles.itemsGroup}>
                <h3>Accommodations</h3>
                <div className={styles.itemsList}>
                  {groupedItems.accommodation.map(item => (
                    <div key={item.id} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <h4>{item.title}</h4>
                        {item.location && <p className={styles.itemLocation}>{item.location}</p>}
                      </div>
                      {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                      <div className={styles.itemDetails}>
                        {item.start_time && item.end_time && (
                          <p className={styles.itemTime}>
                            {new Date(item.start_time).toLocaleDateString()} - {new Date(item.end_time).toLocaleDateString()}
                          </p>
                        )}
                        {item.cost && (
                          <p className={styles.itemCost}>
                            {item.cost} {item.currency || 'USD'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Activities */}
            {groupedItems.activity && (
              <div className={styles.itemsGroup}>
                <h3>Activities</h3>
                <div className={styles.itemsList}>
                  {groupedItems.activity.map(item => (
                    <div key={item.id} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <h4>{item.title}</h4>
                        {item.location && <p className={styles.itemLocation}>{item.location}</p>}
                      </div>
                      {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                      <div className={styles.itemDetails}>
                        {item.start_time && (
                          <p className={styles.itemTime}>
                            {new Date(item.start_time).toLocaleString()}
                            {item.end_time && ` - ${new Date(item.end_time).toLocaleTimeString()}`}
                          </p>
                        )}
                        {item.cost && (
                          <p className={styles.itemCost}>
                            {item.cost} {item.currency || 'USD'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Transportation */}
            {groupedItems.transportation && (
              <div className={styles.itemsGroup}>
                <h3>Transportation</h3>
                <div className={styles.itemsList}>
                  {groupedItems.transportation.map(item => (
                    <div key={item.id} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <h4>{item.title}</h4>
                        {item.location && <p className={styles.itemLocation}>{item.location}</p>}
                      </div>
                      {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                      <div className={styles.itemDetails}>
                        {item.start_time && (
                          <p className={styles.itemTime}>
                            {new Date(item.start_time).toLocaleString()}
                            {item.end_time && ` - ${new Date(item.end_time).toLocaleTimeString()}`}
                          </p>
                        )}
                        {item.reservation_code && (
                          <p className={styles.itemReservation}>
                            Reservation: {item.reservation_code}
                          </p>
                        )}
                        {item.cost && (
                          <p className={styles.itemCost}>
                            {item.cost} {item.currency || 'USD'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Notes */}
            {groupedItems.note && (
              <div className={styles.itemsGroup}>
                <h3>Notes</h3>
                <div className={styles.itemsList}>
                  {groupedItems.note.map(item => (
                    <div key={item.id} className={styles.itemCard}>
                      <div className={styles.itemHeader}>
                        <h4>{item.title}</h4>
                      </div>
                      {item.description && <p className={styles.itemDescription}>{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.qrCodeSection}>
        <h2>Share Your Trip</h2>
        <p>Scan this QR code to share your trip details.</p>
        <div className={styles.qrCodePlaceholder}>
          QR code will be generated here
        </div>
      </div>
    </div>
  );
}
