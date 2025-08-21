# Raahi Server API

Backend server for the Raahi travel planner application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret_replace_this_with_a_long_random_string
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. To get your Google OAuth credentials:
   - Go to the [Google Developer Console](https://console.developers.google.com/)
   - Create a new project
   - Set up OAuth consent screen
   - Create OAuth client ID credentials (Web application)
   - Set the authorized redirect URI to: `http://localhost:5000/api/auth/google/callback`
   - Copy the Client ID and Client Secret to your `.env` file

## Running the server

- For development:
  ```
  npm run dev
  ```

- For production:
  ```
  npm start
  ```

## API Endpoints

### Authentication

- `GET /api/auth/google`: Initiates Google OAuth login
- `GET /api/auth/google/callback`: Google OAuth callback
- `GET /api/auth/logout`: Logs out the user
- `GET /api/auth/failed`: Login failure endpoint

### User

- `GET /api/user/me`: Gets the current authenticated user's information (protected route)

### Health Check

- `GET /api/health`: Server health check

## Authentication Flow

1. Frontend redirects to `/api/auth/google`
2. User authenticates with Google
3. Server redirects to frontend with JWT token: `{CLIENT_URL}/dashboard?token={JWT}`
4. Frontend stores the token and uses it for authenticated requests

## Protected Routes

For protected routes, include the JWT token in the Authorization header:
```
Authorization: Bearer {JWT}
```
