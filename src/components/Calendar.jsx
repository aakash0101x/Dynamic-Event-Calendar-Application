import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday } from "date-fns";
import EventModal from "./EventModal";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // For showing event details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDates, setFilteredDates] = useState([]);
  const [matchingEvents, setMatchingEvents] = useState([]);

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        if (parsedEvents && typeof parsedEvents === "object") {
          setEvents(parsedEvents);
        }
      } catch (error) {
        console.error("Failed to parse events from localStorage:", error);
      }
    }
  }, []);

  // Save events to localStorage whenever events state changes
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  // Filter dates and events based on search query
  useEffect(() => {
    if (searchQuery) {
      const matchingDates = [];
      const matchingEventsList = [];

      Object.entries(events).forEach(([date, eventsList]) => {
        const filteredEvents = eventsList.filter((event) =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredEvents.length > 0) {
          matchingDates.push(date);
          filteredEvents.forEach((event) =>
            matchingEventsList.push({ ...event, date })
          );
        }
      });

      setFilteredDates(matchingDates);
      setMatchingEvents(matchingEventsList);
    } else {
      setFilteredDates([]);
      setMatchingEvents([]);
    }
  }, [searchQuery, events]);

  const handleDayClick = (day) => {
    setSelectedDate(format(day, "yyyy-MM-dd"));
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };

      // Check for overlapping events
      const existingEvents = updatedEvents[selectedDate] || [];
      const isOverlap = existingEvents.some(
        (existingEvent) =>
          (event.startTime < existingEvent.endTime && event.startTime >= existingEvent.startTime) ||
          (event.endTime > existingEvent.startTime && event.endTime <= existingEvent.endTime) ||
          (event.startTime <= existingEvent.startTime && event.endTime >= existingEvent.endTime)
      );

      if (isOverlap) {
        alert("Error: This event overlaps with an existing event.");
        return prevEvents; // Prevent saving if there's an overlap
      }

      // If no overlap, add the new event
      if (!updatedEvents[selectedDate]) updatedEvents[selectedDate] = [];
      updatedEvents[selectedDate].push(event);

      return updatedEvents;
    });
  };

  const handleDeleteEvent = (index) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[selectedDate].splice(index, 1);
      if (updatedEvents[selectedDate].length === 0) {
        delete updatedEvents[selectedDate];
      }
      return updatedEvents;
    });
  };

  const handleEditEvent = (index, updatedEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = { ...prevEvents };
      updatedEvents[selectedDate][index] = updatedEvent;
      return updatedEvents;
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event); // Show details of the clicked event
  };

  const handleCloseEventDetails = () => {
    setSelectedEvent(null); // Close the event details view
  };

  // Helper function to get events for the current month
  const getEventsForMonth = () => {
    const startOfCurrentMonth = startOfMonth(currentDate);
    const endOfCurrentMonth = endOfMonth(currentDate);
    const monthEvents = {};

    Object.entries(events).forEach(([date, eventList]) => {
      const eventDate = new Date(date);
      if (eventDate >= startOfCurrentMonth && eventDate <= endOfCurrentMonth) {
        monthEvents[date] = eventList;
      }
    });

    return monthEvents;
  };

  // Export events as JSON
  const exportAsJSON = () => {
    const monthEvents = getEventsForMonth();
    const dataStr = JSON.stringify(monthEvents, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `events-${format(currentDate, "MMMM-yyyy")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export events as CSV
  const exportAsCSV = () => {
    const monthEvents = getEventsForMonth();
    const rows = [["Date", "Event Name", "Start Time", "End Time", "Description"]];

    Object.entries(monthEvents).forEach(([date, eventList]) => {
      eventList.forEach((event) => {
        rows.push([
          date,
          event.name,
          event.startTime,
          event.endTime,
          event.description || "",
        ]);
      });
    });

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `events-${format(currentDate, "MMMM-yyyy")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const days = [];
  const startOfCurrentMonth = startOfMonth(currentDate);
  const endOfCurrentMonth = endOfMonth(currentDate);

  // Calculate full weeks (including previous and next months)
  const calendarStart = startOfWeek(startOfCurrentMonth);
  const calendarEnd = endOfWeek(endOfCurrentMonth);

  eachDayOfInterval({ start: calendarStart, end: calendarEnd }).forEach((date) => {
    days.push(date);
  });

  return (
    <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1))
          }
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Previous
        </button>
        <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <button
          onClick={() =>
            setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1))
          }
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Next
        </button>
      </div>

      {/* Export Buttons */}
      <div className="mb-4 flex justify-between">
        <button
          onClick={exportAsJSON}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
        >
          Export JSON
        </button>
        <button
          onClick={exportAsCSV}
          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
        >
          Export CSV
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded px-4 py-2 focus:outline-indigo-500"
        />
      </div>

      {/* Display "No Match Found" if no results */}
      {searchQuery && filteredDates.length === 0 && (
        <div className="text-center text-red-500 font-bold mb-4">
          No Match Found
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}

        {days.map((day) => {
          const formattedDay = format(day, "yyyy-MM-dd");
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isTodayDate = isToday(day);
          const isFiltered =
            filteredDates.length === 0 || filteredDates.includes(formattedDay);
          const isSelectedDate = formattedDay === selectedDate;
          return (
            <div
              key={formattedDay}
              className={`p-2 border rounded cursor-pointer ${isCurrentMonth ? "" : "bg-gray-200"
                } ${isTodayDate ? "border-green-500 font-bold bg-green-300" : ""} ${isFiltered ? "" : "opacity-20"
                }${isSelectedDate ? "bg-blue-200 border-blue-500 font-bold" : ""
                }`}
              onClick={() => isFiltered && isCurrentMonth && handleDayClick(day)}
            >
              <div>{format(day, "d")}</div>
              {events[formattedDay] && (
                <div className="mt-1 text-sm text-blue-600">
                  {events[formattedDay].length} events
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* List of Matching Events */}
      {searchQuery && matchingEvents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Matching Events</h3>
          <ul className="list-disc list-inside">
            {matchingEvents.map((event, index) => (
              <li
                key={index}
                className="mb-2 cursor-pointer list-none"
                onClick={() => handleEventClick(event)}
              >
                <strong>{event.name}</strong> on <i>{event.date} ({event.startTime} -{" "}
                  {event.endTime})</i>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Event Details */}
      {selectedEvent && (
        <div className="mt-6 p-4 bg-gray-100 border rounded">
          <h3 className="text-lg font-semibold mb-2">Event Details</h3>
          <p>
            <strong>Name:</strong> {selectedEvent.name}
          </p>
          <p>
            <strong>Date:</strong> {selectedEvent.date}
          </p>
          <p>
            <strong>Time:</strong> {selectedEvent.startTime} - {selectedEvent.endTime}
          </p>
          {selectedEvent.description && (
            <p>
              <strong>Description:</strong> {selectedEvent.description}
            </p>
          )}
          <button
            onClick={handleCloseEventDetails}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Close
          </button>
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        events={events[selectedDate] || []}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        onEdit={handleEditEvent}
      />
    </div>
  );
};

export default Calendar;
