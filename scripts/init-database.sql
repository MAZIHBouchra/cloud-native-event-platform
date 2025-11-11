-- EventHub Database Schema
-- Comprehensive event registration platform with AWS integration

-- Users table: stores authentication and profile information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  role ENUM('PARTICIPANT', 'ORGANIZER') DEFAULT 'PARTICIPANT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Events table: stores event details and metadata
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(500),
  event_date TIMESTAMP NOT NULL,
  location_city VARCHAR(100) NOT NULL,
  location_address VARCHAR(255) NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  status ENUM('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED') DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_organizer (organizer_id),
  INDEX idx_event_date (event_date),
  INDEX idx_city (location_city),
  INDEX idx_status (status),
  FULLTEXT idx_search (title, description)
);

-- Registrations table: tracks participant event registrations
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  participant_id UUID NOT NULL,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('REGISTERED', 'CANCELLED') DEFAULT 'REGISTERED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_registration (event_id, participant_id),
  INDEX idx_participant (participant_id),
  INDEX idx_event (event_id)
);

-- Notifications table: stores email and in-app notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type ENUM('REGISTRATION_CONFIRMATION', 'EVENT_REMINDER', 'SEAT_WARNING') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message LONGTEXT NOT NULL,
  related_event_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_is_read (is_read)
);

-- Sample test data for development
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
  ('participant@example.com', '$2b$10$test_hash_participant', 'John', 'Participant', 'PARTICIPANT'),
  ('organizer@example.com', '$2b$10$test_hash_organizer', 'Jane', 'Organizer', 'ORGANIZER');

INSERT INTO events (organizer_id, title, description, category, location_city, location_address, total_seats, available_seats, status, event_date) 
SELECT id, 'Web Development Masterclass', 'Learn modern web development with React, Next.js, and TailwindCSS', 'Technology', 'New York', '123 Tech Street, NYC', 100, 85, 'PUBLISHED', DATE_ADD(NOW(), INTERVAL 30 DAY)
FROM users WHERE role = 'ORGANIZER' LIMIT 1;

INSERT INTO events (organizer_id, title, description, category, location_city, location_address, total_seats, available_seats, status, event_date)
SELECT id, 'Design Systems Workshop', 'Build scalable design systems for modern applications', 'Design', 'San Francisco', '456 Design Ave, SF', 50, 25, 'PUBLISHED', DATE_ADD(NOW(), INTERVAL 15 DAY)
FROM users WHERE role = 'ORGANIZER' LIMIT 1;
