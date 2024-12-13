import React, { useState } from "react";

const categories = {
  Work: "bg-indigo-600 text-white",
  Personal: "bg-emerald-500 text-white",
  Others: "bg-amber-500 text-white",
};

const EventModal = ({
  isOpen,
  onClose,
  selectedDate,
  events,
  onSave,
  onDelete,
  onEdit,
}) => {
  const [eventName, setEventName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [editingEventIndex, setEditingEventIndex] = useState(null);

  const resetForm = () => {
    setEventName("");
    setStartTime("");
    setEndTime("");
    setDescription("");
    setCategory("Work");
    setEditingEventIndex(null);
  };

  const handleSubmit = () => {
    const newEvent = {
      name: eventName,
      startTime,
      endTime,
      description,
      category,
    };

    if (editingEventIndex !== null) {
      onEdit(editingEventIndex, newEvent);
    } else {
      onSave(newEvent);
    }
    resetForm();
    onClose();
  };

  const handleEdit = (event, index) => {
    setEventName(event.name);
    setStartTime(event.startTime);
    setEndTime(event.endTime);
    setDescription(event.description);
    setCategory(event.category);
    setEditingEventIndex(index);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-2xl ring-1 ring-gray-200 animate-fade-in">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Events for {selectedDate}
            </h3>
          </div>

          {/* Event List */}
          <div className="p-4 max-h-64 overflow-y-auto">
            {events.length > 0 ? (
              <ul className="space-y-3">
                {events.map((event, index) => (
                  <li
                    key={index}
                    className={`p-3 rounded-lg flex justify-between items-center transition-all duration-200 ease-in-out ${categories[event.category]} hover:opacity-90`}
                  >
                    <div className="flex-grow pr-4">
                      <div className="font-bold text-sm">{event.name}</div>
                      <div className="text-xs opacity-80">
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="text-xs mt-1 opacity-70">{event.description}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(event, index)}
                        className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(index)}
                        className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500 py-4">No events for this day.</div>
            )}
          </div>

          {/* Event Form */}
          <div className="p-6 space-y-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
            >
              {editingEventIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EventModal;