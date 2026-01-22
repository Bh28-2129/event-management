const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Create event (Organizer only)
router.post('/', async (req, res) => {
  if (!req.session.userId || req.session.userRole !== 'ORGANIZER') {
    return res.status(403).json({ error: 'Only organizers can create events' });
  }

  try {
    const { name, description, capacity, date, time, venue } = req.body;
    
    const event = await prisma.event.create({
      data: {
        name,
        description,
        capacity: parseInt(capacity),
        date: new Date(date),
        time,
        venue,
        organizerId: req.session.userId
      }
    });

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        organizer: {
          select: { name: true, email: true }
        },
        _count: {
          select: { bookings: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        organizer: {
          select: { name: true, email: true }
        },
        _count: {
          select: { bookings: true }
        }
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search events by name
router.get('/search/:name', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        name: {
          contains: req.params.name,
          mode: 'insensitive'
        }
      },
      include: {
        organizer: {
          select: { name: true }
        },
        _count: {
          select: { bookings: true }
        }
      }
    });

    res.json({ events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
