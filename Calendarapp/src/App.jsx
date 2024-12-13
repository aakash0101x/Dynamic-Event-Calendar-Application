import React from "react";
import Calendar from "./components/Calendar";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="py-4 bg-blue-600 text-white text-center">
        <h1 className="text-2xl font-bold">Dynamic Event Calendar</h1>
      </header>
      <main className="p-4">
        <Calendar />
      </main>
    </div>
  );
}

export default App;
