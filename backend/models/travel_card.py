from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class HotelRequest(BaseModel):
    hotel_name: Optional[str] = None
    location: Optional[str] = None
    check_in_date: Optional[date] = None
    check_out_date: Optional[date] = None
    room_type: Optional[str] = None
    price_per_night: Optional[float] = None
    total_cost: Optional[float] = None

class TransportRequest(BaseModel):
    transport_type: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    booking_reference: Optional[str] = None
    cost: Optional[float] = None
    is_departure: bool = False

class TravelCardCreateRequest(BaseModel):
    destination: str
    start_date: date
    end_date: date
    status: str
    hotels: Optional[List[HotelRequest]] = None
    transports: Optional[List[TransportRequest]] = None

class HotelResponse(BaseModel):
    id: str
    travel_card_id: str
    hotel_name: Optional[str] = None
    location: Optional[str] = None
    check_in_date: Optional[date] = None
    check_out_date: Optional[date] = None
    room_type: Optional[str] = None
    price_per_night: Optional[float] = None
    total_cost: Optional[float] = None

class TransportResponse(BaseModel):
    id: str
    travel_card_id: str
    transport_type: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    booking_reference: Optional[str] = None
    cost: Optional[float] = None
    is_departure: bool = False

class TravelCardResponse(BaseModel):
    id: str
    user_id: str
    destination: str
    start_date: date
    end_date: date
    duration_days: int
    status: str
    hotels: Optional[List[HotelResponse]] = None
    transports: Optional[List[TransportResponse]] = None

class TravelCardUpdateRequest(BaseModel):
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    hotels: Optional[List[HotelRequest]] = None
    transports: Optional[List[TransportRequest]] = None
