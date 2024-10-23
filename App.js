// src/App.js
import React from 'react';
//import CalendarComponent from './components/CalendarComponent';  // Import the calendar component
//import DragDropCalendar from './components/DragDropCalendar';
//import TimeZoneCalendar from './components/TimeZoneCalendar';
// import TwoPanelTimeZoneCalendar from './components/TwoPanelTimeZoneCalendar';
import DynamicTimeZoneCalendar from './components/DynamicTimeZoneCalendar';
import DynamicTimeZoneCalendar2 from './components/DynamicTimeZoneCalendar2';

function App() {
  return (
    <div className="App">
      {/* <CalendarComponent />  Render the FullCalendar component */}
      {/* <DragDropCalendar /> */}
      {/* <TimeZoneCalendar/> */}
      {/* <TwoPanelTimeZoneCalendar/> */}
      <DynamicTimeZoneCalendar/>
      {/* <DynamicTimeZoneCalendar2/> */}
    </div>
  );
}

export default App;
