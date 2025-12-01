import os
from dotenv import load_dotenv

load_dotenv()

PROJECT_URL = os.getenv("PROJECT_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")

if not PROJECT_URL or not SUPABASE_ANON_KEY or not SUPABASE_URL:
    raise ValueError("Missing SUPABASE_URL, PROJECT_URL, or SUPABASE_ANON_KEY in .env file")
