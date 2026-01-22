// Get booking ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookingId = urlParams.get('bookingId');

async function loadBookingDetails() {
  if (!bookingId) {
    showError('No booking ID provided');
    return;
  }

  try {
    const response = await fetch(`/api/bookings/${bookingId}`);
    
    if (!response.ok) {
      showError('Booking not found');
      return;
    }

    const data = await response.json();
    const booking = data.booking;

    // Populate booking details
    document.getElementById('bookingId').textContent = booking.bookingId;
    document.getElementById('eventName').textContent = booking.event.name;
    document.getElementById('participantName').textContent = booking.user.name;
    document.getElementById('participantEmail').textContent = booking.user.email;
    document.getElementById('eventDate').textContent = new Date(booking.event.date).toLocaleDateString();
    document.getElementById('eventTime').textContent = booking.event.time;
    document.getElementById('eventVenue').textContent = booking.event.venue;
    document.getElementById('bookingDate').textContent = new Date(booking.createdAt).toLocaleString();

    document.getElementById('confirmationDetails').style.display = 'block';
  } catch (error) {
    showError('Failed to load booking details');
  }
}

function showError(message) {
  document.getElementById('confirmationDetails').style.display = 'none';
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

loadBookingDetails();
