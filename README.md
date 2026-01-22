# Event Management System

A full-stack event management platform built with Node.js, Express, PostgreSQL, and Bootstrap.

## Features

- **User Authentication**: Login/Signup with role-based access (Organizer/Participant)
- **Event Creation**: Organizers can create events with details (name, description, capacity, date, time, venue)
- **Event Booking**: Participants can search and book available events
- **Booking Confirmation**: Unique booking ID generation with complete event details
- **Responsive Design**: Bootstrap-powered responsive UI

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Session Management**: express-session
- **Authentication**: bcryptjs

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and update the `DATABASE_URL` with your PostgreSQL credentials.

3. **Setup Database**
   ```bash
   npx prisma db push
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   Open browser and navigate to `http://localhost:3000`

## Usage

### For Organizers:
1. Sign up with role "Organizer"
2. Login and navigate to "Book Event"
3. Fill in event details (name, description, capacity, date, time, venue)
4. Submit to create the event

### For Participants:
1. Sign up with role "Participant"
2. Login and navigate to "Book Event"
3. Search for events by name or browse all events
4. Click on an event to select it
5. Submit to book the event
6. View confirmation page with booking ID and details

## Project Structure

```
event-management-system/
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   ├── css/
│   │   └── style.css       # Custom styles
│   ├── js/
│   │   ├── auth.js         # Authentication logic
│   │   ├── main.js         # Main page logic
│   │   ├── booking.js      # Booking page logic
│   │   └── confirmation.js # Confirmation page logic
│   ├── index.html          # Login/Signup page
│   ├── main.html           # Home page
│   ├── booking.html        # Booking page
│   └── confirmation.html   # Confirmation page
├── routes/
│   ├── auth.js             # Auth routes
│   ├── events.js           # Event routes
│   └── bookings.js         # Booking routes
├── server.js               # Main server file
├── package.json
└── .env.example
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Events
- `POST /api/events` - Create event (Organizer only)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/search/:name` - Search events by name

### Bookings
- `POST /api/bookings` - Book an event
- `GET /api/bookings/my` - Get user's bookings
- `GET /api/bookings/:bookingId` - Get booking details

## License

MIT
