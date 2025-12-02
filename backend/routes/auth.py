from fastapi import APIRouter, HTTPException, status, Depends
from models.auth import RegisterRequest, LoginRequest, AuthResponse, CurrentUser
from utils.password import hash_password, verify_password
from utils.jwt_handler import create_access_token
from db.supabase_client import get_user_by_email, create_user
from routes.dependencies import get_current_user

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
    
    # Generate JWT token
    token = create_access_token(user["id"], user["email"], user["full_name"])
    
    return AuthResponse(
        success=True,
        user_id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        token=token,
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
    
    # Generate JWT token
    token = create_access_token(user["id"], user["email"], user["full_name"])
    
    return AuthResponse(
        success=True,
        user_id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        token=token,
        message="Login successful"
    )

@router.post("/logout", response_model=AuthResponse)
def logout(current_user: dict = Depends(get_current_user)):
    return AuthResponse(
        success=True,
        message="Logged out successfully"
    )

@router.get("/me")
def get_user_profile(current_user: dict = Depends(get_current_user)):
    return {
        "success": True,
        "user_id": current_user["user_id"],
        "email": current_user["email"],
        "full_name": current_user["full_name"],
        "first_name": current_user["full_name"].split()[0],
    }

