from datetime import datetime, date
from db.supabase_client import supabase

def calculate_duration(start_date: date, end_date: date) -> int:
    delta = end_date - start_date
    return delta.days + 1

def create_travel_card_with_nested(user_id: str, destination: str, start_date: date, end_date: date, status: str = "planning", hotels: list = None, transports: list = None):
    duration_days = calculate_duration(start_date, end_date)
    
    try:
        # Create travel card
        card_response = supabase.table("travel_cards").insert({
            "user_id": user_id,
            "destination": destination,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "duration_days": duration_days,
            "status": status
        }).execute()
        
        if not card_response.data:
            return None
        
        travel_card = card_response.data[0]
        travel_card_id = travel_card["id"]
        
        # Add hotels if provided
        if hotels:
            for hotel in hotels:
                supabase.table("hotels").insert({
                    "travel_card_id": travel_card_id,
                    "hotel_name": hotel["hotel_name"],
                    "location": hotel["location"],
                    "check_in_date": hotel["check_in_date"].isoformat(),
                    "check_out_date": hotel["check_out_date"].isoformat(),
                    "room_type": hotel.get("room_type"),
                    "price_per_night": hotel.get("price_per_night"),
                    "total_cost": hotel.get("total_cost"),
                }).execute()
        
        # Add transports if provided
        if transports:
            for transport in transports:
                supabase.table("transports").insert({
                    "travel_card_id": travel_card_id,
                    "transport_type": transport["transport_type"],
                    "origin": transport["origin"],
                    "destination": transport["destination"],
                    "departure_time": transport["departure_time"],
                    "arrival_time": transport["arrival_time"],
                    "booking_reference": transport.get("booking_reference"),
                    "cost": transport.get("cost"),
                    "is_departure": transport.get("is_departure", False),
                }).execute()
        
        return travel_card
        
    except Exception as e:
        print(f"Error creating travel card: {e}")
        return None

def get_travel_cards_by_user(user_id: str):
    try:
        response = supabase.table("travel_cards").select("*").eq("user_id", user_id).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching travel cards: {e}")
        return None

def get_travel_card_by_id(card_id: str, user_id: str):
    try:
        response = supabase.table("travel_cards").select("*").eq("id", card_id).eq("user_id", user_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error fetching travel card: {e}")
        return None

def get_hotels_by_card(card_id: str):
    try:
        response = supabase.table("hotels").select("*").eq("travel_card_id", card_id).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching hotels: {e}")
        return None

def get_transports_by_card(card_id: str):
    try:
        response = supabase.table("transports").select("*").eq("travel_card_id", card_id).execute()
        return response.data if response.data else []
    except Exception as e:
        print(f"Error fetching transports: {e}")
        return None

def update_travel_card(card_id: str, user_id: str, updates: dict):
    try:
        # Recalculate duration if dates changed
        if "start_date" in updates and "end_date" in updates:
            updates["duration_days"] = calculate_duration(updates["start_date"], updates["end_date"])
        elif "start_date" in updates or "end_date" in updates:
            card = get_travel_card_by_id(card_id, user_id)
            if card:
                start = updates.get("start_date") or card["start_date"]
                end = updates.get("end_date") or card["end_date"]
                updates["duration_days"] = calculate_duration(start, end)
        
        response = supabase.table("travel_cards").update(updates).eq("id", card_id).eq("user_id", user_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        print(f"Error updating travel card: {e}")
        return None

def update_travel_card_with_nested(card_id: str, user_id: str, destination: str = None, start_date: date = None, end_date: date = None, status: str = None, hotels: list = None, transports: list = None):
    try:
        # Verify card exists and belongs to user
        card = get_travel_card_by_id(card_id, user_id)
        if not card:
            return None
        
        # Prepare card updates (only non-null values)
        card_updates = {}
        if destination is not None:
            card_updates["destination"] = destination
        if start_date is not None:
            card_updates["start_date"] = start_date.isoformat()
        if end_date is not None:
            card_updates["end_date"] = end_date.isoformat()
        if status is not None:
            card_updates["status"] = status
        
        # Recalculate duration if dates are being updated
        if start_date is not None or end_date is not None:
            start = start_date if start_date is not None else card["start_date"]
            end = end_date if end_date is not None else card["end_date"]
            card_updates["duration_days"] = calculate_duration(start, end)
        
        # Update card if there are any updates
        if card_updates:
            card_response = supabase.table("travel_cards").update(card_updates).eq("id", card_id).eq("user_id", user_id).execute()
            if not card_response.data:
                return None
            card = card_response.data[0]
        
        # Handle hotels if provided
        if hotels is not None:
            # Get existing hotel IDs in database
            existing_hotels = get_hotels_by_card(card_id)
            existing_hotel_ids = {h["id"] for h in existing_hotels} if existing_hotels else set()
            
            # Track hotel IDs from the request
            request_hotel_ids = set()
            
            for hotel in hotels:
                if "id" in hotel and hotel["id"]:
                    # Update existing hotel
                    request_hotel_ids.add(hotel["id"])
                    hotel_updates = {k: v for k, v in hotel.items() if k != "id"}
                    supabase.table("hotels").update(hotel_updates).eq("id", hotel["id"]).eq("travel_card_id", card_id).execute()
                else:
                    # Create new hotel
                    supabase.table("hotels").insert({
                        "travel_card_id": card_id,
                        "hotel_name": hotel["hotel_name"],
                        "location": hotel["location"],
                        "check_in_date": hotel["check_in_date"].isoformat(),
                        "check_out_date": hotel["check_out_date"].isoformat(),
                        "room_type": hotel.get("room_type"),
                        "price_per_night": hotel.get("price_per_night"),
                        "total_cost": hotel.get("total_cost"),
                    }).execute()
            
            # Delete hotels not in the request
            hotels_to_delete = existing_hotel_ids - request_hotel_ids
            for hotel_id in hotels_to_delete:
                supabase.table("hotels").delete().eq("id", hotel_id).execute()
        
        # Handle transports if provided
        if transports is not None:
            # Get existing transport IDs in database
            existing_transports = get_transports_by_card(card_id)
            existing_transport_ids = {t["id"] for t in existing_transports} if existing_transports else set()
            
            # Track transport IDs from the request
            request_transport_ids = set()
            
            for transport in transports:
                if "id" in transport and transport["id"]:
                    # Update existing transport
                    request_transport_ids.add(transport["id"])
                    transport_updates = {k: v for k, v in transport.items() if k != "id"}
                    supabase.table("transports").update(transport_updates).eq("id", transport["id"]).eq("travel_card_id", card_id).execute()
                else:
                    # Create new transport
                    supabase.table("transports").insert({
                        "travel_card_id": card_id,
                        "transport_type": transport["transport_type"],
                        "origin": transport["origin"],
                        "destination": transport["destination"],
                        "departure_time": transport["departure_time"],
                        "arrival_time": transport["arrival_time"],
                        "booking_reference": transport.get("booking_reference"),
                        "cost": transport.get("cost"),
                        "is_departure": transport.get("is_departure", False),
                    }).execute()
            
            # Delete transports not in the request
            transports_to_delete = existing_transport_ids - request_transport_ids
            for transport_id in transports_to_delete:
                supabase.table("transports").delete().eq("id", transport_id).execute()
        
        # Return updated card with nested data
        updated_card = get_travel_card_by_id(card_id, user_id)
        return updated_card
        
    except Exception as e:
        print(f"Error updating travel card with nested data: {e}")
        return None

def delete_travel_card(card_id: str, user_id: str):
    try:
        response = supabase.table("travel_cards").delete().eq("id", card_id).eq("user_id", user_id).execute()
        return True
    except Exception as e:
        print(f"Error deleting travel card: {e}")
        return False
