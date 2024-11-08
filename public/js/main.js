document.addEventListener('DOMContentLoaded', () => {
    loadSlots();
    loadMeetings();
  
    // Event listener for booking form submission
    document.getElementById('booking-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const response = await fetch('/book', {
        method: 'POST',
        body: new URLSearchParams(formData)
      });
      
      if (response.ok) {
        alert('Meeting booked successfully!');
        loadSlots();
        loadMeetings();
        closeModal();
      } else {
        alert('Error booking meeting.');
      }
    });
  });
  
  // Load available slots via AJAX
  async function loadSlots() {
    const response = await fetch('/slots');
    const slots = await response.json();
    const slotsDiv = document.getElementById('slots');
    slotsDiv.innerHTML = '';
  
    slots.forEach(slot => {
      const slotElement = document.createElement('div');
      slotElement.innerHTML = `
        <span>${slot.time_slot} - Available Slots: ${slot.available}</span>
        <button onclick="openModal(${slot.id})">Book</button>
      `;
      slotsDiv.appendChild(slotElement);
    });
  }
  
  // Load scheduled meetings via AJAX
  async function loadMeetings() {
    const response = await fetch('/meetings');
    const meetings = await response.json();
    const meetingsDiv = document.getElementById('meetings');
    meetingsDiv.innerHTML = '';
  
    meetings.forEach(meeting => {
      const meetingElement = document.createElement('div');
      meetingElement.innerHTML = `
        <span>${meeting.name} - ${meeting.email} (${meeting.Slot.time_slot})</span>
        <button onclick="cancelMeeting(${meeting.id})">Cancel</button>
      `;
      meetingsDiv.appendChild(meetingElement);
    });
  }
  
  // Open the booking modal
  function openModal(slotId) {
    document.getElementById('slotId').value = slotId;
    document.getElementById('booking-modal').style.display = 'block';
  }
  
  // Close the booking modal
  function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
  }
  
  // Cancel a meeting via AJAX
  async function cancelMeeting(meetingId) {
    const response = await fetch(`/cancel/${meetingId}`, {
      method: 'POST'
    });
  
    if (response.ok) {
      alert('Meeting canceled successfully!');
      loadSlots();
      loadMeetings();
    } else {
      alert('Error canceling meeting.');
    }
  }
  