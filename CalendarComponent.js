// src/components/CalendarComponent.js
import React from 'react';
import FullCalendar from '@fullcalendar/react';  // FullCalendar React component
import dayGridPlugin from '@fullcalendar/daygrid';  // Plugin for day grid view
import interactionPlugin from '@fullcalendar/interaction';  // Necessary for date click handling

const CalendarComponent = () => {
  const handleDateClick = (arg) => {
    console.log(`Date clicked: ${arg.dateStr}`);  // Log the clicked date
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}  // Include interactionPlugin here
      initialView="dayGridMonth"
      events={[
        { title: 'Event 1', date: '2024-10-21' },
        { title: 'Event 2', date: '2024-10-22' },
      ]}
      dateClick={handleDateClick}  // Set up the date click handler
      height={"90vh"}  // Adjust height if needed
    />
  );
};

export default CalendarComponent;
