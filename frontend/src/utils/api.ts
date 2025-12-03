const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

interface AuthResponse {
  success: boolean;
  user_id?: string;
  email?: string;
  full_name?: string;
  token?: string;
  message: string;
  error?: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.detail || 'Login failed',
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.detail || 'Registration failed',
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}
