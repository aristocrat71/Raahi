from fastapi import APIRouter, HTTPException, status
from models.auth import RegisterRequest, LoginRequest, AuthResponse, ErrorResponse
from utils.password import hash_password, verify_password
from db.supabase_client import get_user_by_email, create_user

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
def register(request: RegisterRequest):
    # Check if user already exists
    existing_user = get_user_by_email(request.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password and create user
    password_hash = hash_password(request.password)
    user = create_user(request.email, password_hash, request.full_name)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    return AuthResponse(
        success=True,
        user_id=user["id"],
        email=user["email"],
        message="User registered successfully"
    )

@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest):
    # Find user by email
    user = get_user_by_email(request.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    return AuthResponse(
        success=True,
        user_id=user["id"],
        email=user["email"],
        message="Login successful"
    )
