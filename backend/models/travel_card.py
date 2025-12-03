from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class HotelRequest(BaseModel):
    hotel_name: str
    location: str
    check_in_date: date
    check_out_date: date
    room_type: Optional[str] = None
    price_per_night: Optional[float] = None
    total_cost: Optional[float] = None

class TransportRequest(BaseModel):
    transport_type: str
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
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
    hotel_name: str
    location: str
    check_in_date: date
    check_out_date: date
    room_type: Optional[str]
    price_per_night: Optional[float]
    total_cost: Optional[float]

class TransportResponse(BaseModel):
    id: str
    travel_card_id: str
    transport_type: str
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
    booking_reference: Optional[str]
    cost: Optional[float]
    is_departure: bool

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
