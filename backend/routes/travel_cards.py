from fastapi import APIRouter, HTTPException, status, Depends
from models.travel_card import (
    TravelCardCreateRequest,
    TravelCardUpdateRequest,
    TravelCardResponse,
    HotelResponse,
    TransportResponse,
)
from db.travel_card_service import (
    create_travel_card_with_nested,
    get_travel_cards_by_user,
    get_travel_card_by_id,
    get_hotels_by_card,
    get_transports_by_card,
    update_travel_card_with_nested,
    delete_travel_card,
)
from routes.dependencies import get_current_user

router = APIRouter()

@router.post("/travel-cards", response_model=TravelCardResponse)
def create_travel_card(
    request: TravelCardCreateRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    
    # Validate dates
    if request.end_date < request.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Convert hotel/transport requests to dicts for service
    hotels = [h.dict() for h in request.hotels] if request.hotels else None
    transports = [t.dict() for t in request.transports] if request.transports else None
    
    card = create_travel_card_with_nested(
        user_id,
        request.destination,
        request.start_date,
        request.end_date,
        hotels,
        transports
    )
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create travel card"
        )
    
    # Fetch nested data
    hotels_data = get_hotels_by_card(card["id"]) if request.hotels else None
    transports_data = get_transports_by_card(card["id"]) if request.transports else None
    
    return TravelCardResponse(
        id=card["id"],
        user_id=card["user_id"],
        destination=card["destination"],
        start_date=card["start_date"],
        end_date=card["end_date"],
        duration_days=card["duration_days"],
        status=card["status"],
        hotels=hotels_data,
        transports=transports_data,
    )

@router.get("/travel-cards")
def get_all_travel_cards(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    cards = get_travel_cards_by_user(user_id)
    
    if cards is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch travel cards"
        )
    
    # Add nested data to each card
    cards_with_nested = []
    for card in cards:
        hotels = get_hotels_by_card(card["id"])
        transports = get_transports_by_card(card["id"])
        
        card_response = TravelCardResponse(
            id=card["id"],
            user_id=card["user_id"],
            destination=card["destination"],
            start_date=card["start_date"],
            end_date=card["end_date"],
            duration_days=card["duration_days"],
            status=card["status"],
            hotels=hotels,
            transports=transports,
        )
        cards_with_nested.append(card_response)
    
    return cards_with_nested

@router.get("/travel-cards/{card_id}", response_model=TravelCardResponse)
def get_travel_card(card_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    card = get_travel_card_by_id(card_id, user_id)
    
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel card not found"
        )
    
    hotels = get_hotels_by_card(card_id)
    transports = get_transports_by_card(card_id)
    
    return TravelCardResponse(
        id=card["id"],
        user_id=card["user_id"],
        destination=card["destination"],
        start_date=card["start_date"],
        end_date=card["end_date"],
        duration_days=card["duration_days"],
        status=card["status"],
        hotels=hotels,
        transports=transports,
    )

@router.put("/travel-cards/{card_id}", response_model=TravelCardResponse)
def update_travel_card_endpoint(
    card_id: str,
    request: TravelCardUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    
    # Verify card exists and belongs to user
    existing_card = get_travel_card_by_id(card_id, user_id)
    if not existing_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel card not found"
        )
    
    # Validate dates if both provided
    start_date = request.start_date or existing_card["start_date"]
    end_date = request.end_date or existing_card["end_date"]
    
    if request.start_date and request.end_date:
        if request.end_date < request.start_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be after start date"
            )
    elif request.start_date and end_date < request.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    elif request.end_date and request.end_date < start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date must be after start date"
        )
    
    # Convert hotel/transport requests to dicts for service
    hotels = [h.dict() for h in request.hotels] if request.hotels else None
    transports = [t.dict() for t in request.transports] if request.transports else None
    
    updated_card = update_travel_card_with_nested(
        card_id,
        user_id,
        destination=request.destination,
        start_date=request.start_date,
        end_date=request.end_date,
        status=request.status,
        hotels=hotels,
        transports=transports
    )
    
    if not updated_card:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update travel card"
        )
    
    hotels_data = get_hotels_by_card(card_id)
    transports_data = get_transports_by_card(card_id)
    
    return TravelCardResponse(
        id=updated_card["id"],
        user_id=updated_card["user_id"],
        destination=updated_card["destination"],
        start_date=updated_card["start_date"],
        end_date=updated_card["end_date"],
        duration_days=updated_card["duration_days"],
        status=updated_card["status"],
        hotels=hotels_data,
        transports=transports_data,
    )

@router.delete("/travel-cards/{card_id}")
def delete_travel_card_endpoint(card_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]
    
    # Verify card exists and belongs to user
    existing_card = get_travel_card_by_id(card_id, user_id)
    if not existing_card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Travel card not found"
        )
    
    success = delete_travel_card(card_id, user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete travel card"
        )
    
    return {
        "success": True,
        "message": "Travel card deleted successfully"
    }
