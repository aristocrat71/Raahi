"use client";

import { useAuth } from "@/context/auth/AuthContext";
import { Trip, TripItem, CreateTripDto, CreateTripItemDto } from "@/types/trip";

// Base API URL
const API_URL = "http://localhost:5000/api";

/**
 * TripService provides methods to interact with the trip-related endpoints
 */
export const useTripService = () => {
  const { user } = useAuth();
  
  // Helper function for API requests with authentication
  const authFetch = async (endpoint, options = {}) => {
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
  const getUserTrips = async () => {
    return authFetch('/trips');
  };
  
  // Get a specific trip by ID
  const getTripById = async (tripId) => {
    return authFetch(`/trips/${tripId}`);
  };
  
  // Create a new trip
  const createTrip = async (tripData) => {
    return authFetch('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData)
    });
  };
  
  // Update an existing trip
  const updateTrip = async (tripId, tripData) => {
    return authFetch(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData)
    });
  };
  
  // Delete a trip
  const deleteTrip = async (tripId) => {
    return authFetch(`/trips/${tripId}`, {
      method: 'DELETE'
    });
  };
  
  // Add an item to a trip
  const addTripItem = async (tripId, itemData) => {
    return authFetch(`/trips/${tripId}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  };
  
  // Get all items for a trip
  const getTripItems = async (tripId) => {
    return authFetch(`/trips/${tripId}/items`);
  };
  
  // Upload an image
  const uploadImage = async (file) => {
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found");
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/upload`, {
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
