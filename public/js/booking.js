let currentUser = null;

// Check authentication and load appropriate form
async function init() {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      window.location.href = '/';
      return;
    }
    const data = await response.json();
    currentUser = data.user;
    document.getElementById('userName').textContent = `Hello, ${data.user.name}`;

    if (data.user.role === 'ORGANIZER') {
      document.getElementById('formTitle').textContent = 'Create Event';
      document.getElementById('organizerForm').style.display = 'block';
    } else {
      document.getElementById('formTitle').textContent = 'Book Event';
      document.getElementById('participantForm').style.display = 'block';
      loadAllEvents();
    }
  } catch (error) {
    window.location.href = '/';
  }
}

// Organizer: Create Event
document.getElementById('organizerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      showMessage('Event created successfully!', 'success');
      e.target.reset();
    } else {
      showMessage(result.error || 'Failed to create event', 'danger');
    }
  } catch (error) {
    showMessage('An error occurred', 'danger');
  }
});

// Participant: Search Events
document.getElementById('searchBtn')?.addEventListener('click', async () => {
  const searchTerm = document.getElementById('eventSearch').value.trim();
  if (!searchTerm) {
    loadAllEvents();
    return;
  }

  try {
    const response = await fetch(`/api/events/search/${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    displayEvents(data.events);
  } catch (error) {
    showMessage('Search failed', 'danger');
  }
});

// Load all events
async function loadAllEvents() {
  try {
    const response = await fetch('/api/events');
    const data = await response.json();
    displayEvents(data.events);
  } catch (error) {
    showMessage('Failed to load events', 'danger');
  }
}

// Display events list
function displayEvents(events) {
  const eventsList = document.getElementById('eventsList');
  
  if (!events || events.length === 0) {
    eventsList.innerHTML = '<div class="alert alert-info">No events found</div>';
    return;
  }

  eventsList.innerHTML = events.map(event => {
    const availableSpots = event.capacity - event._count.bookings;
    const eventDate = new Date(event.date).toLocaleDateString();
    
    return `
      <div class="card event-card mb-2" onclick="selectEvent(${event.id}, '${event.name}', '${eventDate}', '${event.time}', '${event.venue}', ${availableSpots})">
        <div class="card-body">
          <h6 class="card-title mb-1">${event.name}</h6>
          <small class="text-muted">
            ${eventDate} at ${event.time} | ${event.venue}<br>
            Available: ${availableSpots}/${event.capacity} spots
          </small>
        </div>
      </div>
    `;
  }).join('');
}

// Select event for booking
function selectEvent(id, name, date, time, venue, availableSpots) {
  if (availableSpots <= 0) {
    showMessage('This event is fully booked', 'warning');
    return;
  }

  document.getElementById('selectedEventId').value = id;
  document.getElementById('selectedEventName').textContent = name;
  document.getElementById('selectedEventDetails').textContent = 
    `Date: ${date} | Time: ${time} | Venue: ${venue}`;
  document.getElementById('selectedEventInfo').style.display = 'block';
}

// Participant: Book Event
document.getElementById('participantForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const eventId = document.getElementById('selectedEventId').value;

  if (!eventId) {
    showMessage('Please select an event', 'warning');
    return;
  }

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId })
    });

    const result = await response.json();

    if (response.ok) {
      window.location.href = `/confirmation?bookingId=${result.booking.bookingId}`;
    } else {
      showMessage(result.error || 'Booking failed', 'danger');
    }
  } catch (error) {
    showMessage('An error occurred', 'danger');
  }
});

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await fetch('/api/auth/logout', { method: 'POST' });
  window.location.href = '/';
});

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

init();
