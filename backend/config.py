import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_URL = os.getenv("PROJECT_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# JWT Configuration
JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise ValueError("JWT_SECRET must be set in environment variables")

JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))

if not PROJECT_URL or not SUPABASE_ANON_KEY or not SUPABASE_URL:
    raise ValueError("Missing SUPABASE_URL, PROJECT_URL, or SUPABASE_ANON_KEY in .env file")
