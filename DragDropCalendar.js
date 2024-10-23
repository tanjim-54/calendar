import React, { useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // Add Time Grid Plugin
import interactionPlugin from '@fullcalendar/interaction';
import { DateTime } from 'luxon'; // Import Luxon for date-time handling

const DragDropCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Class in Bangladesh',
      start: DateTime.fromObject({ year: 2024, month: 10, day: 21, hour: 15, minute: 0, zone: 'Asia/Dhaka' }).toISO(), // 3 PM in Bangladesh
      allDay: false,
    },
  ]);

  const handleDragStart = useCallback((event) => {
    console.log('Drag start:', event);
    event.dataTransfer.setData('text/plain', JSON.stringify({ title: 'New Event' }));
  }, []);

  const handleDrop = useCallback((info) => {
    console.log('Drop:', info);
    const newEventData = JSON.parse(info.draggedEl.getAttribute('data-event'));
    const newEvent = {
      id: String(Date.now()), // Generate a unique ID
      title: newEventData.title,
      start: info.dateStr + 'T15:00:00', // Set the time for the new event (3 PM local time)
      allDay: false,
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', padding: '10px', borderRight: '1px solid #ccc' }}>
        <h3>Draggable Events</h3>
        <div
          className="fc-event"
          draggable
          onDragStart={handleDragStart}
          data-event='{"title": "New Event"}'
          style={{ padding: '10px', border: '1px solid #000', marginBottom: '10px', cursor: 'move' }}
        >
          New Event
        </div>
      </div>
      <div style={{ flex: 1, padding: '10px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek" // Use time grid view
          events={events}
          editable={true}
          droppable={true}
          drop={handleDrop} // Handle new event drops
          timeZone="local" // Show events in the user's local time zone
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay,dayGridMonth',
          }}
        />
      </div>
    </div>
  );
};

export default DragDropCalendar;
