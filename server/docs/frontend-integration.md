# Frontend Integration Guide

This guide explains how to integrate the Raahi authentication API with your Next.js frontend.

## Authentication Flow

1. User clicks "Login with Google" button
2. User is redirected to Google authentication
3. After successful authentication, user is redirected back to the dashboard with a JWT token
4. Frontend stores the token and uses it for authenticated requests

## Implementation Steps

### 1. Create Auth Context

Create a file `src/context/AuthContext.tsx`:

```tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for token in URL (after redirect from Google OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    
    if (storedToken) {
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/user/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 2. Update the Root Layout

Update your `src/app/layout.tsx` to include the AuthProvider:

```tsx
// Other imports
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: updateThemeScript }} />
      </head>
      <body className={montserrat.className}>
        <AuthProvider>
          <ThemeProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 3. Add Login Button to Header

Update your Header component to include the login/logout functionality:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, login, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Raahi
        </Link>

        <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.open : ''}`}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/about" className={styles.navLink}>About</Link>
          {user ? (
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
          ) : null}
        </div>

        <div className={styles.rightSection}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            )}
          </button>

          {loading ? (
            <div className={styles.loadingDot}></div>
          ) : user ? (
            <div className={styles.userMenu}>
              <div className={styles.userAvatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
              </div>
              <div className={styles.userDropdown}>
                <div className={styles.userName}>{user.name}</div>
                <button onClick={logout} className={styles.logoutButton}>Logout</button>
              </div>
            </div>
          ) : (
            <button onClick={login} className={styles.loginButton}>
              Login
            </button>
          )}

          <button 
            className={styles.mobileMenuButton} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 4. Create a Dashboard Page

Create a file `src/app/dashboard/page.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import styles from './page.module.css';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // This will be redirected by the useEffect
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.welcomeSection}>
        <h1>Welcome, {user.name}!</h1>
        <p>This is your personal travel dashboard where you can plan and manage your trips.</p>
      </div>
      
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardCard}>
          <h2>My Trips</h2>
          <p>You don't have any trips planned yet.</p>
          <button className={styles.primaryButton}>Create New Trip</button>
        </div>
        
        <div className={styles.dashboardCard}>
          <h2>Travel Recommendations</h2>
          <p>Based on your preferences, here are some destinations you might enjoy:</p>
          <ul className={styles.recommendationList}>
            <li>Paris, France</li>
            <li>Tokyo, Japan</li>
            <li>New York City, USA</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

### 5. Create Protected Route Middleware

You can create a middleware file to protect routes requiring authentication:

```tsx
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the route is a protected route
  const isProtectedRoute = [
    '/dashboard',
    '/trips',
    '/settings',
  ].some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedRoute) {
    // This is a client-side check only
    // The real authentication happens in the components using useAuth
    
    // For more strict protection, you could implement server-side validation
    // by calling your backend to verify the token
  }

  return NextResponse.next();
}
```

## Making Authenticated API Requests

When you need to make authenticated requests to your API from the frontend, use the stored token:

```tsx
const fetchData = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Handle unauthenticated state
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/your-endpoint', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      // Handle data
    } else {
      // Handle error response
    }
  } catch (error) {
    console.error('API request failed:', error);
  }
};
```

## Adding Google Login Button

For a better user experience, you can create a custom Google login button:

```tsx
// components/GoogleLoginButton.tsx
import styles from './GoogleLoginButton.module.css';

export default function GoogleLoginButton({ onClick }) {
  return (
    <button onClick={onClick} className={styles.googleButton}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="#4285F4"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Continue with Google
    </button>
  );
}
```

This guide provides a comprehensive approach to integrating the authentication system with your Next.js frontend.
