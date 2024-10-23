import React, { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import moment from 'moment-timezone';

const DynamicTimeZoneCalendar = () => {
  const [userTimeZone, setUserTimeZone] = useState('UTC');
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Class in Bangladesh',
      start: '2024-10-21T15:00:00+06:00',
      end: '2024-10-21T16:00:00+06:00',
    },
    {
      id: '2',
      title: 'Class in UK',
      start: '2024-10-22T14:00:00+01:00',
      end: '2024-10-22T15:00:00+01:00',
    }
  ]);

  useEffect(() => {
    // Detect user's time zone
    const detectedTimeZone = moment.tz.guess();
    setUserTimeZone(detectedTimeZone);
  }, []);

  const handleDateSelect = useCallback((selectInfo) => {
    const title = prompt('Please enter a title for the new event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };
      setEvents(prev => [...prev, newEvent]);
    }
  }, []);

  const handleEventClick = useCallback((clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      setEvents(prev => prev.filter(event => event.id !== clickInfo.event.id));
    }
  }, []);

  const handleEventDrop = useCallback((dropInfo) => {
    setEvents(prev => prev.map(event => 
      event.id === dropInfo.event.id
        ? { ...event, start: dropInfo.event.startStr, end: dropInfo.event.endStr }
        : event
    ));
  }, []);

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h2>Calendar in {userTimeZone} time</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentTimezonePlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        timeZone={userTimeZone}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekNumbers={true}
        nowIndicator={true}
        select={handleDateSelect}
        eventContent={renderEventContent}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        height="auto"
      />
    </div>
  );
};

export default DynamicTimeZoneCalendar;