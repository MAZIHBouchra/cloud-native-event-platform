# EventHub - Event Registration Platform

A modern, scalable event registration platform built with Next.js, Node.js, and AWS services.

## Features

### For Participants
- Browse and search events by location, category, and date
- Register for events with instant confirmation
- Manage event registrations from personal dashboard
- Receive email notifications and reminders
- Track event attendance history

### For Organizers
- Create and manage events with detailed information
- Upload event images to AWS S3
- View participant lists and manage registrations
- Track event capacity and availability
- Edit or cancel events

### Platform Features
- Modern, responsive UI with Tailwind CSS
- Real-time seat availability tracking
- Dark mode support
- Advanced event filtering and search
- Secure authentication with JWT
- Email notifications (AWS SES)
- Scalable architecture with AWS

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: React hooks + SWR
- **HTTP Client**: Fetch API
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: AWS RDS (PostgreSQL/MySQL)
- **Authentication**: JWT + AWS Cognito
- **Image Storage**: AWS S3

### AWS Services
- **RDS**: Database hosting
- **S3**: Image storage
- **Cognito**: User authentication
- **SES**: Email notifications
- **Elastic Beanstalk**: Backend deployment
- **CloudWatch**: Monitoring and logging
- **Secrets Manager**: Secure credential storage

## Project Structure

\`\`\`
eventhub/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/              # Authentication endpoints
│   │   └── events/            # Event management endpoints
│   ├── dashboard/             # User dashboards
│   │   └── organizer/         # Organizer-specific pages
│   ├── event/                 # Event detail pages
│   ├── events/                # Event browse page
│   ├── login/                 # Login page
│   ├── signup/                # Sign up page
│   ├── page.tsx               # Home page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
├── components/
│   ├── navbar.tsx             # Navigation component
│   ├── footer.tsx             # Footer component
│   ├── event-card.tsx         # Reusable event card
│   └── ui/                    # shadcn UI components
├── lib/
│   └── hooks/
│       ├── use-auth.ts        # Authentication hook
│       └── use-events.ts      # Events data fetching
├── scripts/
│   └── init-database.sql      # Database schema
└── public/
    └── placeholder.svg        # Placeholder images
\`\`\`

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- AWS Account (for deployment)

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yourusername/eventhub.git
cd eventhub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

\`\`\`
DATABASE_URL=postgresql://user:password@localhost:5432/eventhub
JWT_SECRET=your-secret-key-here
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_BUCKET=eventhub-images
AWS_REGION=us-east-1
COGNITO_USER_POOL_ID=your-pool-id
COGNITO_CLIENT_ID=your-client-id
\`\`\`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Event Endpoints
- `GET /api/events` - List all public events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event (organizer only)
- `PUT /api/events/:id` - Update event (organizer only)
- `DELETE /api/events/:id` - Delete event (organizer only)
- `POST /api/events/:id/join` - Register for event
- `DELETE /api/events/:id/leave` - Unregister from event

## Features Implemented

### Core Features
- ✅ User registration and authentication
- ✅ Event browsing with search and filters
- ✅ Event registration and management
- ✅ User dashboard for participants
- ✅ Organizer dashboard for event management
- ✅ Responsive design for mobile, tablet, desktop
- ✅ Real-time seat availability tracking

### Advanced Features
- 🔄 Email notifications (AWS SES)
- 🔄 Image upload to S3
- 🔄 AWS Cognito integration
- 🔄 CloudWatch monitoring
- 🔄 Dark mode toggle

## Future Enhancements

- Payment processing with Stripe
- Event categories and tags
- User reviews and ratings
- Social sharing features
- PDF ticket generation
- Event analytics dashboard
- Mobile app

## Deployment

See [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for complete deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@eventhub.com or open an issue on GitHub.

---

Built with ❤️ by EventHub Team
