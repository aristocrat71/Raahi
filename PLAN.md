# Raahi Project Plan

## Progress Tracking Checklist

- [ ] Design & Schema (In Progress)
  - [x] User Management
  - [x] Travel Card
  - [x] Hotel/Accommodation
  - [x] Transport
  - [ ] Finalize data model
- [ ] Tech Stack Setup
  - [x] Frontend (React + Vite)
  - [x] Backend (Python + FastAPI)
  - [x] Database selection - Postgre with Supabase.
- [ ] Frontend Development
  - [ ] Login/Authentication UI
  - [ ] Travel Card Creation Form
  - [ ] Hotel Management Component
  - [ ] Transport Management Component
  - [ ] Card Expansion UI
- [ ] Backend Development
  - [ ] User authentication API
  - [ ] Travel Card CRUD endpoints
  - [ ] Hotel CRUD endpoints
  - [ ] Transport CRUD endpoints
  - [ ] Database integration
- [ ] Testing
  - [ ] Unit tests
  - [ ] Integration tests
  - [ ] API testing
- [ ] Deployment
  - [ ] Frontend deployment
  - [ ] Backend deployment
  - [ ] Database setup

---

## Core Components & Data Model

### **1. User Management**
- Simple email/password authentication
- User profile storage

### **2. Travel Card (Main Entity)**
```
TravelCard {
  id: UUID
  userId: UUID
  destination: string
  startDate: date
  endDate: date
  durationDays: number
  createdAt: timestamp
  updatedAt: timestamp
  
  // Nested relationships
  accommodation: Hotel
  departureTransport: Transport
  arrivalTransport: Transport
  status: "planning" | "booked" | "completed"
}
```

### **3. Hotel (Accommodation)**
```
Hotel {
  id: UUID
  travelCardId: UUID
  hotelName: string
  location: string
  checkInDate: date
  checkOutDate: date
  roomType: string
  pricePerNight: number
  totalCost: number
}
```

### **4. Transport**
```
Transport {
  id: UUID
  travelCardId: UUID
  type: "flight" | "train" | "bus" | "car"
  origin: string
  destination: string
  departureTime: datetime
  arrivalTime: datetime
  bookingReference: string
  cost: number
}
```

## Features

### MVP (Minimum Viable Product)
1. **Authentication**
   - Email/password login
   - User registration

2. **Travel Card Management**
   - Create travel card with destination, dates, duration
   - View all travel cards
   - Update travel card information
   - Delete travel card

3. **Hotel Management**
   - Add hotel details to travel card
   - Edit hotel information
   - Remove hotel details

4. **Transport Management**
   - Add departure transport option
   - Add arrival transport option
   - Edit transport details
   - Remove transport details

### Future Enhancements
- Budget tracking (total trip cost estimation)
- Activity/Itinerary section (day-wise activities)
- Notes field (reminders, tips)
- Trip sharing (invite friends to same trip)
- Trip collaboration features

## CRUD Operations Summary

| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| TravelCard | ✅ | ✅ | ✅ | ✅ |
| Hotel | ✅ | ✅ | ✅ | ✅ |
| Transport | ✅ | ✅ | ✅ | ✅ |
| User | ✅ | ✅ | ✅ | ✅ |

## Tech Stack (To Be Finalized)
- **Frontend**: React + Vite
- **Backend**: Python + FastAPI
- **Database**: (To be decided - PostgreSQL/MongoDB)
- **Authentication**: JWT or session-based
