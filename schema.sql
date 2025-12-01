-- Raahi Travel Planning Application Database Schema

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Travel Cards Table
CREATE TABLE travel_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT NOT NULL,
    status VARCHAR(50) DEFAULT 'planning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Hotels Table
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    travel_card_id UUID NOT NULL,
    hotel_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    room_type VARCHAR(100),
    price_per_night DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (travel_card_id) REFERENCES travel_cards(id) ON DELETE CASCADE
);

-- Transports Table
CREATE TABLE transports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    travel_card_id UUID NOT NULL,
    transport_type VARCHAR(50) NOT NULL,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    booking_reference VARCHAR(100),
    cost DECIMAL(10, 2),
    is_departure BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (travel_card_id) REFERENCES travel_cards(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX idx_travel_cards_user_id ON travel_cards(user_id);
CREATE INDEX idx_hotels_travel_card_id ON hotels(travel_card_id);
CREATE INDEX idx_transports_travel_card_id ON transports(travel_card_id);
CREATE INDEX idx_users_email ON users(email);

-- Comments
COMMENT ON TABLE users IS 'Stores user authentication and profile information';
COMMENT ON TABLE travel_cards IS 'Main travel itinerary cards with destination and dates';
COMMENT ON TABLE hotels IS 'Hotel accommodation details for each travel card';
COMMENT ON TABLE transports IS 'Transport options (flights, trains, buses, cars) for trips';
