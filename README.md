# Dynamic Event Calendar Application

A **Dynamic Event Calendar Application** built with React.js to manage and display events on a calendar interface. The app provides a clean UI and intuitive functionality for users to add, edit, and delete events, with data persistence using `localStorage`.

---

## **Features**

### **1. Calendar View**
- Displays a **calendar grid** for the current month.
- Properly aligns dates according to the real-world calendar, including leading and trailing empty cells for weeks that span multiple months.
- **Navigation**: Switch between months using "Previous" and "Next" buttons.
- **Highlighting**:
  - The current date is visually highlighted in green.
  - The selected date is visually highlighted in blue.

### **2. Event Management**
- **Add Events**:
  - Add events by selecting a specific day on the calendar.
  - Enter details such as:
    - Event name
    - Start time and end time
    - Optional description
    - Event category (e.g., Work, Personal, Others)
- **Edit Events**:
  - Modify details of existing events.
- **Delete Events**:
  - Remove unwanted events from a specific day.

### **3. Event List**
- Displays a list of events for the selected day in a modal.
- Events are color-coded based on their categories (e.g., Work = Blue, Personal = Green, Others = Yellow).

### **4. Data Persistence**
- All events are stored in the browser’s `localStorage`, ensuring data is saved across page reloads.

### **5. Event Search**
- A **search bar** allows users to find events based on keywords.
- Matching events are highlighted, and a list of results is displayed.
- Clicking on a matching event shows its details.

### **6. Export Events**
- Users can download events for the currently displayed month in either **JSON** or **CSV** format.
- Includes event details like date, name, time, and description.

---

## **Technologies Used**

### **Frontend**
- **React.js**: Framework for building the user interface.
- **date-fns**: Library for date manipulation and formatting.
- **Tailwind-CSS**: For styling the application.

### **State Management**
- React's `useState` and `useEffect` hooks are used for managing application state.

### **Storage**
- **localStorage**: Used to persist events across sessions.

---

## **File Structure**

### **1. App.js**
- Entry point of the application.
- Renders the `Calendar` component.

### **2. Calendar.jsx**
- Core component for the calendar view.
- **Responsibilities**:
  - Renders the calendar grid.
  - Manages state for:
    - `currentDate`: The currently displayed month.
    - `selectedDate`: The currently selected date.
    - `events`: All events mapped to their respective dates.
  - Integrates with the `EventModal` component for event management.
  - Handles navigation between months.

### **3. EventModal.jsx**
- A reusable modal for adding, editing, and deleting events.
- **Responsibilities**:
  - Displays a list of events for the selected day.
  - Provides a form to add or edit event details.
  - Sends data back to `Calendar.jsx` via callbacks (`onSave`, `onEdit`, `onDelete`).

---

## **Getting Started**

### **Prerequisites**
- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org).
- **npm** or **yarn**: Ensure a package manager is installed.

### **Installation**
1. Clone the repository:
   ```bash
   gh repo clone aakash0101x/Dynamic-Event-Calendar-Application
2. Install dependencies:
   ```bash
   npm install
3. Start Development Servr:
   ```bash
   npm start
4. Open your browser and navigaate to:
   ```bash
   http://localhost:5173
## Usage Instructions
### 1. View Events:
- Select a day to view its events in a modal.
### 2. Add Events:
- Click on a day and fill out the event form (name, time, description, and category).
### 3. Edit/Delete Events:
- Use the "Edit" or "Delete" buttons next to an event in the modal.
### 4. Navigate Calendar:
- Use the "Previous" and "Next" buttons to switch between months.
## Key Libraries
### 1. date-fns
Used for date manipulation and formatting:

- `format`: To format dates for display.
- `startOfMonth`, `endOfMonth`: To determine the start and end dates of the current month.
- `startOfWeek`, `endOfWeek`: To align the calendar with real-world dates.
- `eachDayOfInterval`: To generate all dates within a specified interval.
- `isToday`: To highlight the current date.

## License
This project is licensed under the MIT License.
