"use client";

import { useAuth } from "@/context/auth/AuthContext";
import { Trip, TripItem, CreateTripDto, CreateTripItemDto } from "@/types/trip";

// Base API URL
const API_URL = "http://localhost:5000/api";

// Types for API responses
interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
  message?: string;
}

/**
 * TripService provides methods to interact with the trip-related endpoints
 */
export const useTripService = () => {
  const { user } = useAuth();
  
  // Helper function for API requests with authentication
  const authFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found");
    }
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return response.json();
  };
  
  // Get all trips for the current user
  const getUserTrips = async (): Promise<Trip[]> => {
    return authFetch<Trip[]>('/trips');
  };
  
  // Get a specific trip by ID
  const getTripById = async (tripId: string): Promise<Trip> => {
    return authFetch<Trip>(`/trips/${tripId}`);
  };
  
  // Create a new trip
  const createTrip = async (tripData: CreateTripDto): Promise<Trip> => {
    return authFetch<Trip>('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    });
  };
  
  // Update an existing trip
  const updateTrip = async (tripId: string, tripData: Partial<CreateTripDto>): Promise<Trip> => {
    return authFetch<Trip>(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData)
    });
  };
  
  // Delete a trip
  const deleteTrip = async (tripId: string): Promise<{ success: boolean; message: string }> => {
    return authFetch<{ success: boolean; message: string }>(`/trips/${tripId}`, {
      method: 'DELETE'
    });
  };
  
  // Add an item to a trip
  const addTripItem = async (tripId: string, itemData: CreateTripItemDto): Promise<TripItem> => {
    return authFetch<TripItem>(`/trips/${tripId}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  };
  
  // Get all items for a trip
  const getTripItems = async (tripId: string): Promise<TripItem[]> => {
    return authFetch<TripItem[]>(`/trips/${tripId}/items`);
  };
  
  // Upload an image
  const uploadImage = async (file: File): Promise<{ success: boolean; url: string }> => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found");
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/upload/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }
    
    return response.json();
  };
  
  return {
    getUserTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
    addTripItem,
    getTripItems,
    uploadImage
  };
};
