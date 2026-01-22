const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Create booking (Participant only)
router.post('/', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please login to book an event' });
  }

  try {
    const { eventId } = req.body;
    
    const event = await prisma.event.findUnique({
      where: { id: parseInt(eventId) },
      include: {
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event._count.bookings >= event.capacity) {
      return res.status(400).json({ error: 'Event is fully booked' });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        eventId_userId: {
          eventId: parseInt(eventId),
          userId: req.session.userId
        }
      }
    });

    if (existingBooking) {
      return res.status(400).json({ error: 'You have already booked this event' });
    }

    const booking = await prisma.booking.create({
      data: {
        eventId: parseInt(eventId),
        userId: req.session.userId
      },
      include: {
        event: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user bookings
router.get('/my', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Please login' });
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.session.userId },
      include: {
        event: {
          include: {
            organizer: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:bookingId', async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { bookingId: req.params.bookingId },
      include: {
        event: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
