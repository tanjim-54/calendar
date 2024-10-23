import React, { useState, useCallback, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';
import moment from 'moment-timezone';

const DynamicTimeZoneCalendar = () => {
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC');
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Class in Bangladesh',
      start: '2024-10-14T15:00:00',
      end: '2024-10-14T16:00:00',
      originalTimezone: 'Asia/Dhaka',
      originalStartTime: '15:00',
      originalEndTime: '16:00'
    },
    {
      id: '2',
      title: 'Class in UK',
      start: '2024-10-22T14:00:00',
      end: '2024-10-22T15:00:00',
      originalTimezone: 'Europe/London',
      originalStartTime: '14:00',
      originalEndTime: '15:00'
    },
    {
      id: '3',
      title: 'Class in Bangladesh',
      start: '2024-10-02T14:00:00',
      end: '2024-10-03T15:00:00',
      originalTimezone: 'Asia/Dhaka',
      originalStartTime: '14:00',
      originalEndTime: '15:00'
    },
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

  const validateTimeFormat = (time) => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  const convertEventTimes = useCallback((events, targetTimezone) => {
    return events.map(event => {
      const startMoment = moment.tz(event.start, event.originalTimezone);
      const endMoment = moment.tz(event.end, event.originalTimezone);
      
      return {
        ...event,
        start: startMoment.tz(targetTimezone).format(),
        end: endMoment.tz(targetTimezone).format()
      };
    });
  }, []);

  const handleTimeZoneChange = (event) => {
    setSelectedTimeZone(event.target.value);
  };

  const handleDateSelect = useCallback((selectInfo) => {
    const title = prompt('Please enter a title for the new event');
    if (!title) return;

    let startTime = prompt('Enter start time (HH:mm in 24-hour format)', '09:00');
    if (!startTime || !validateTimeFormat(startTime)) {
      alert('Invalid start time format. Please use HH:mm in 24-hour format');
      return;
    }

    let endTime = prompt('Enter end time (HH:mm in 24-hour format)', '10:00');
    if (!endTime || !validateTimeFormat(endTime)) {
      alert('Invalid end time format. Please use HH:mm in 24-hour format');
      return;
    }

    // Use the same date for both start and end if it's a single-day selection
    const startDate = moment(selectInfo.start).format('YYYY-MM-DD');
    const endDate = selectInfo.allDay ? 
      moment(selectInfo.end).subtract(1, 'days').format('YYYY-MM-DD') : 
      startDate;

    const newEvent = {
      id: String(Date.now()),
      title,
      start: `${startDate}T${startTime}:00`,
      end: `${endDate}T${endTime}:00`,
      originalTimezone: selectedTimeZone,
      originalStartTime: startTime,
      originalEndTime: endTime
    };

    setEvents(prev => [...prev, newEvent]);
    selectInfo.view.calendar.unselect();
  }, [selectedTimeZone]);

  const handleEventClick = useCallback((clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
      setEvents(prev => prev.filter(event => event.id !== clickInfo.event.id));
    }
  }, []);

  const handleEventDrop = useCallback((dropInfo) => {
    const droppedEvent = events.find(event => event.id === dropInfo.event.id);
    const newStartTime = moment(dropInfo.event.start).format('HH:mm');
    const newEndTime = moment(dropInfo.event.end).format('HH:mm');

    setEvents(prev => prev.map(event => 
      event.id === dropInfo.event.id
        ? { 
            ...event, 
            start: dropInfo.event.startStr, 
            end: dropInfo.event.endStr,
            originalTimezone: selectedTimeZone,
            originalStartTime: newStartTime,
            originalEndTime: newEndTime
          }
        : event
    ));
  }, [selectedTimeZone, events]);

  const renderEventContent = (eventInfo) => {
    const event = events.find(e => e.id === eventInfo.event.id);
    const localStartTime = moment.tz(eventInfo.event.start, selectedTimeZone).format('HH:mm');
    const originalTz = event.originalTimezone;
    
    return (
      <div className="p-1"  style={{border : '1px solid blue', borderRadius:'5px', backgroundColor:'#0866ff', color : 'white'}}>
        <div className="font-bold">{eventInfo.event.title}</div>
        <div className="text-sm">
          <span className="text-gray-600">Local: {localStartTime}</span>
          <br />
          <span className="text-gray-600">Original ({originalTz.split('/')[1]}): {event.originalStartTime}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 p-4 border-r border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Select Time Zone</h3>
        <select 
          value={selectedTimeZone} 
          onChange={handleTimeZoneChange}
          className="w-full p-2 mb-4 border rounded"
        >
          {timeZoneOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-sm mb-2">Current Time Zone: {selectedTimeZone}</p>
        <p className="text-sm">Local Time: {moment().tz(selectedTimeZone).format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>

      <div className="flex-1 p-4" style={{border : '2px solid #0866ff', borderRadius:'5px'}}>
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
          // weekNumbers={true}
          nowIndicator={true}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          selectConstraint={{ start: '00:00', end: '24:00' }}
        />
      </div>
    </div>
  );
};

export default DynamicTimeZoneCalendar;



