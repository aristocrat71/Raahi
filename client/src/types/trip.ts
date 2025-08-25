// Define trip-related types for the application
export interface Trip {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  location: string;
  cover_image?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface TripItem {
  id: string;
  trip_id: string;
  type: 'activity' | 'accommodation' | 'transportation' | 'note';
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  cost?: number;
  currency?: string;
  reservation_code?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTripDto {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location: string;
  isPublic?: boolean;
  coverImage?: string;
}

export interface CreateTripItemDto {
  type: 'activity' | 'accommodation' | 'transportation' | 'note';
  title: string;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  cost?: number;
  currency?: string;
  reservationCode?: string;
  imageUrl?: string;
}
