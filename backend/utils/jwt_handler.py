from datetime import datetime, timedelta
from jose import JWTError, jwt
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS

def create_access_token(user_id: str, email: str, full_name: str) -> str:
    payload = {
        "user_id": user_id,
        "email": email,
        "full_name": full_name,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

def extract_token_from_header(authorization: str) -> str:
    if not authorization:
        return None
    
    parts = authorization.split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    
    return None
