# EventHub Project Structure

## Overview
EventHub is a modern event registration platform built with Next.js 16, React 19, and TypeScript. It provides a seamless experience for discovering, registering for, and managing events.

## Architecture

### Frontend Structure
- **Pages**: Event discovery, details, authentication, and dashboards
- **Components**: Reusable UI components (EventCard, Navbar, Footer)
- **Hooks**: Custom hooks for authentication and data fetching (useAuth, useEvents)
- **Styles**: Tailwind CSS with design system tokens for consistent branding

### Backend Structure
- **API Routes**: RESTful endpoints for authentication, events, and registrations
- **Database**: Mock data layer (replace with Neon/Supabase in production)
- **Authentication**: JWT token-based with localStorage persistence

## Key Features

### Public Features
- Browse events with search and filtering
- View event details and availability
- User registration and login

### Participant Features
- Dashboard for managing registrations
- Event registration with seat tracking
- Profile management

### Organizer Features
- Create and manage events
- Track registrations and participants
- Event analytics

## Database Schema

### Users Table
- id (primary key)
- email (unique)
- password_hash
- first_name, last_name
- role (PARTICIPANT | ORGANIZER)
- created_at

### Events Table
- id (primary key)
- organizer_id (foreign key)
- title, description, category
- event_date, event_time
- city, address
- total_seats, available_seats
- image_url
- status (DRAFT | PUBLISHED | CANCELLED)
- created_at

### Registrations Table
- id (primary key)
- event_id (foreign key)
- participant_id (foreign key)
- registration_date
- status

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Events
- `GET /api/events` - List events with filters
- `POST /api/events` - Create event (organizer only)
- `GET /api/events/[id]` - Get event details
- `POST /api/events/[id]/join` - Register for event

## Scalability Considerations

### Performance
- SWR for client-side caching and data synchronization
- Database indexing on frequently queried fields
- CDN caching for static assets
- Pagination for large result sets

### Security
- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation on all endpoints
- Row-level security (RLS) for database

### Deployment
- Deploy to Vercel for serverless infrastructure
- Use Neon or Supabase for managed PostgreSQL
- AWS S3 for image storage
- AWS SES for email notifications

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables (see .env.example)
3. Run development server: `npm run dev`
4. Open http://localhost:3000

## Future Enhancements

- Email notifications for registrations
- Event calendar view
- Payment integration for paid events
- Event reviews and ratings
- Advanced analytics dashboard
- Mobile app with React Native
