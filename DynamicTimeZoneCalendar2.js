import React, { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import moment from 'moment-timezone';

const DynamicTimeZoneCalendar2 = () => {
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC');
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Class in Bangladesh',
      start: '2024-10-21T15:00:00',
      end: '2024-10-21T16:00:00',
      originalTimezone: 'Asia/Dhaka'
    },
    {
      id: '2',
      title: 'Class in UK',
      start: '2024-10-22T14:00:00',
      end: '2024-10-22T15:00:00',
      originalTimezone: 'Europe/London'
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
    const detectedTimeZone = moment.tz.guess();
    setSelectedTimeZone(detectedTimeZone);
  }, []);

  const convertEventTimes = useCallback((events, targetTimezone) => {
    return events.map(event => {
      const startMoment = moment.tz(event.start, event.originalTimezone);
      const endMoment = moment.tz(event.end, event.originalTimezone);
      
      // Format the time for display
      const timeStr = startMoment.tz(targetTimezone).format('HH:mm');
      
      return {
        ...event,
        start: startMoment.tz(targetTimezone).format(),
        end: endMoment.tz(targetTimezone).format(),
        displayTitle: `${timeStr} - ${event.title}` // Add time to title
      };
    });
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
        originalTimezone: selectedTimeZone
      };
      setEvents(prev => [...prev, newEvent]);
    }
  }, [selectedTimeZone]);

  const handleEventClick = useCallback((clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      setEvents(prev => prev.filter(event => event.id !== clickInfo.event.id));
    }
  }, []);

  const handleEventDrop = useCallback((dropInfo) => {
    setEvents(prev => prev.map(event => 
      event.id === dropInfo.event.id
        ? { 
            ...event, 
            start: dropInfo.event.startStr, 
            end: dropInfo.event.endStr,
            originalTimezone: selectedTimeZone 
          }
        : event
    ));
  }, [selectedTimeZone]);

  const renderEventContent = (eventInfo) => {
    return (
      <div className="p-1 border border-blue-500 rounded bg-blue-600 text-white">
        <i>{eventInfo.event.extendedProps.displayTitle || eventInfo.event.title}</i>
      </div>
    );
  };

  return (
    <div className="h-screen/2">
      <div className="w-64 p-5 border-r border-gray-200">
        <h3 className="text-lg font-semibold">Select Time Zone</h3>
        <select 
          value={selectedTimeZone} 
          onChange={handleTimeZoneChange}
          className="w-full p-2 mb-5 border rounded"
        >
          {timeZoneOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mb-2">Current Time Zone: {selectedTimeZone}</p>
        <p>Local Time: {moment().tz(selectedTimeZone).format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>

      <div className="flex-1 p-5 border-2 border-blue-600 rounded">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, momentTimezonePlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          timeZone={selectedTimeZone}
          events={convertEventTimes(events, selectedTimeZone)}
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

export default DynamicTimeZoneCalendar2;