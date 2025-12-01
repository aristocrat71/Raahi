from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    success: bool
    user_id: str = None
    email: str = None
    message: str

class ErrorResponse(BaseModel):
    success: bool
    error: str
