"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth/AuthContext";
import { useTripService } from "@/services/tripService";
import { Trip } from "@/types/trip";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";

export default function MyTrips() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const tripService = useTripService();
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (user) {
      loadTrips();
    }
  }, [user]);
  
  const loadTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await tripService.getUserTrips();
      setTrips(data);
    } catch (err) {
      console.error('Error loading trips:', err);
      setError("Failed to load trips. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateTrip = () => {
    router.push('/trips/create');
  };
  
  const handleTripClick = (tripId: string) => {
    router.push(`/trips/${tripId}`);
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Trips</h1>
        <Button onClick={handleCreateTrip}>Create New Trip</Button>
      </div>
      
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading trips...</p>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <Button variant="outline" onClick={loadTrips}>Try Again</Button>
        </div>
      ) : trips.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No trips found</h2>
          <p>Create your first trip to get started!</p>
          <Button onClick={handleCreateTrip}>Create New Trip</Button>
        </div>
      ) : (
        <div className={styles.tripGrid}>
          {trips.map(trip => (
            <div 
              key={trip.id} 
              className={styles.tripCard}
              onClick={() => handleTripClick(trip.id)}
            >
              <div className={styles.tripImage} style={{
                backgroundImage: trip.cover_image 
                  ? `url(${trip.cover_image})` 
                  : 'linear-gradient(to right, var(--accent-light), var(--accent))'
              }}>
                {!trip.cover_image && <span className={styles.tripImageText}>{trip.title.charAt(0)}</span>}
              </div>
              <div className={styles.tripInfo}>
                <h3>{trip.title}</h3>
                <p className={styles.tripLocation}>{trip.location}</p>
                <p className={styles.tripDate}>
                  {new Date(trip.start_date).toLocaleDateString()} - 
                  {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
