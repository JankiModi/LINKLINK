// SendReminder.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Reminders = () => {
  const [message, setMessage] = useState("");
  const [reminders, setReminders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleAddReminders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8000/api/sendReminder/",
        {
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Reminder sent to all residents!");
      setMessage("");
    } catch (error) {
      console.error("Error sending reminder:", error);
    }
  };

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/viewReminders/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const unviewedReminders = [];
        for (const reminder of response.data) {
          if (!reminder.viewed) {
            unviewedReminders.push(reminder);
            await axios.patch(
              `http://localhost:8000/api/reminders/${reminder.id}/markViewed/`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
          }
        }

        setReminders(unviewedReminders);
      } catch (error) {
        setError("Failed to fetch reminders.");
      }
    };

    fetchReminders();
  }, []);
  const handleBackToHousehold = () => {
    navigate("/committee_home");
  };
  return (
    <div>
      <div className="min-h-screen bg-[#E9F1FA] p-28">
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter reminder message"
              className="mt-1 block w-full px-3 py-2 bg-slate-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
            />
            <br></br>
            <button
              className=" rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1c5b70] text-base font-medium text-white hover:bg-[#154456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5b70]"
              onClick={handleAddReminders}
            >
              Send Reminder
            </button>

            {reminders.length > 0 ? (
              <div>
                <h3 className="text-2xl font-bold mb-6 text-[#1c5b70]">
                  Reminders:
                </h3>
                <ul className="space-y-4 mb-8">
                  {reminders.map((reminder) => (
                    <li
                      key={reminder.id}
                      className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
                    >
                      <span className="text-xl font-semibold text-gray-800">
                        {reminder.message} (sent on{" "}
                        {new Date(reminder.created_at).toLocaleDateString()})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No new reminders.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
