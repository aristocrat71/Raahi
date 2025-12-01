from supabase import create_client
from config import PROJECT_URL, SUPABASE_ANON_KEY

supabase = create_client(PROJECT_URL, SUPABASE_ANON_KEY)

def get_user_by_email(email: str):
    response = supabase.table("users").select("*").eq("email", email).execute()
    if response.data:
        return response.data[0]
    return None

def create_user(email: str, password_hash: str, full_name: str):
    response = supabase.table("users").insert({
        "email": email,
        "password_hash": password_hash,
        "full_name": full_name
    }).execute()
    return response.data[0] if response.data else None

def get_user_by_id(user_id: str):
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    if response.data:
        return response.data[0]
    return None
