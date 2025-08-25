"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { useTripService } from '@/services/tripService';
import { CreateTripItemDto } from '@/types/trip';
import Button from '@/components/ui/Button';
import styles from './add-item.module.css';

interface AddItemPageProps {
  params: {
    id: string;
  };
}

export default function AddItemPage({ params }: AddItemPageProps) {
  const tripId = params.id;
  const { user, loading } = useAuth();
  const router = useRouter();
  const tripService = useTripService();
  
  const [formData, setFormData] = useState<CreateTripItemDto>({
    type: 'activity',
    title: '',
    description: '',
    location: '',
    startTime: '',
    endTime: '',
    cost: undefined,
    currency: 'USD',
    reservationCode: '',
    imageUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setFormData(prev => ({ ...prev, [name]: undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (!formData.title || !formData.type) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await tripService.addTripItem(tripId, formData);
      router.push(`/trips/${tripId}`);
    } catch (err) {
      console.error('Error adding trip item:', err);
      setError('Failed to add trip item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
        <h1>Add Trip Item</h1>
      </div>
      
      <div className={styles.formContainer}>
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="type">Item Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="activity">Activity</option>
              <option value="accommodation">Accommodation</option>
              <option value="transportation">Transportation</option>
              <option value="note">Note</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Visit Eiffel Tower"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any details about this item..."
              rows={4}
            />
          </div>
          
          {formData.type !== 'note' && (
            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. 5 Avenue Anatole France, Paris"
              />
            </div>
          )}
          
          {formData.type !== 'note' && (
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startTime">Start Time/Date</label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="endTime">End Time/Date</label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          
          {(formData.type === 'activity' || formData.type === 'accommodation' || formData.type === 'transportation') && (
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="cost">Cost</label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost === undefined ? '' : formData.cost}
                  onChange={handleNumberChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
          )}
          
          {formData.type === 'transportation' && (
            <div className={styles.formGroup}>
              <label htmlFor="reservationCode">Reservation/Confirmation Code</label>
              <input
                type="text"
                id="reservationCode"
                name="reservationCode"
                value={formData.reservationCode}
                onChange={handleChange}
                placeholder="e.g. ABC123"
              />
            </div>
          )}
          
          <div className={styles.actionButtons}>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
