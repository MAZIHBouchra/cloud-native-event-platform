# EventHub Architecture Guide

## System Design

EventHub follows a three-tier architecture:

### 1. Presentation Layer (Frontend)
- **Technology**: React 19 with Next.js 16 App Router
- **Styling**: Tailwind CSS with semantic design tokens
- **State Management**: SWR for client-side caching, React hooks for UI state
- **Components**: Atomic design with reusable components

### 2. Business Logic Layer (API Routes)
- **Framework**: Next.js API Routes (serverless functions)
- **Validation**: Input validation on all endpoints
- **Error Handling**: Consistent error responses with status codes
- **Authentication**: JWT tokens with role-based access control

### 3. Data Layer (Database)
- **Database**: PostgreSQL (via Neon or Supabase)
- **Query Language**: SQL with parameterized queries to prevent injection
- **Caching**: Redis for session management and frequently accessed data

## Key Design Patterns

### Component Composition
Components are built with clear separation of concerns:
- Container components handle data fetching and state
- Presentational components focus on UI rendering
- Custom hooks encapsulate business logic

### Data Flow
1. Client makes request via hook (useEvents, useAuth)
2. SWR caches response and manages revalidation
3. API route validates request and queries database
4. Response is cached and returned to client
5. UI updates reactively

### Error Handling
- Try-catch blocks wrap all async operations
- Consistent error response format
- User-friendly error messages on frontend
- Server errors logged for debugging

## Security Considerations

### Authentication
- JWT tokens stored in localStorage
- Tokens validated on protected API routes
- Password hashing required before storage
- Account lockout after failed login attempts

### Authorization
- Role-based access control (PARTICIPANT vs ORGANIZER)
- Verify user ownership of resources
- Validate permissions on server side

### Data Protection
- HTTPS for all communications
- SQL parameterized queries to prevent injection
- Input validation and sanitization
- CORS configuration

## Performance Optimization

### Caching Strategy
- SWR for client-side caching with revalidation
- Database query results cached in Redis
- Static assets cached on CDN
- Page prerendering where possible

### Query Optimization
- Database indexes on frequently queried fields
- Pagination to limit result sets
- Select only required columns
- Avoid N+1 queries with proper joins

### Frontend Performance
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- CSS-in-JS for critical CSS
- Lazy loading for below-fold components
