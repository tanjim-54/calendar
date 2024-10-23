import React, { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import moment from 'moment-timezone';

const TwoPanelTimeZoneCalendar = () => {
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC');
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

  const timeZoneOptions = [
    { value: 'Asia/Dhaka', label: 'Bangladesh Time' },
    { value: 'Europe/London', label: 'UK Time' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Asia/Tokyo', label: 'Japan Time' },
    { value: 'Australia/Sydney', label: 'Australia Eastern Time' },
  ];

  useEffect(() => {
    // Detect user's time zone on component mount
    const detectedTimeZone = moment.tz.guess();
    setSelectedTimeZone(detectedTimeZone);
  }, []);

  const handleTimeZoneChange = (event) => {
    setSelectedTimeZone(event.target.value);
  };

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
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Panel */}
      <div style={{ width: '250px', padding: '20px', borderRight: '1px solid #ccc' }}>
        <h3>Select Time Zone</h3>
        <select 
          value={selectedTimeZone} 
          onChange={handleTimeZoneChange}
          style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
        >
          {timeZoneOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p>Current Time Zone: {selectedTimeZone}</p>
        <p>Local Time: {moment().tz(selectedTimeZone).format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>

      {/* Right Panel - Calendar */}
      <div style={{ flex: 1, padding: '20px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentTimezonePlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          timeZone={selectedTimeZone}
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
    </div>
  );
};

export default TwoPanelTimeZoneCalendar;