import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const Noticeboard = () => {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(null);
  const [newNoticeAdded, setNewNoticeAdded] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const response = await axios.get("http://localhost:8000/api/notices/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotices(response.data);
      } catch (error) {
        setError("Failed to fetch notices.");
      }
    };

    fetchNotices();
  }, []);

  const handleAddNotice = async (e) => {
    e.preventDefault();
    // Disable the submit button to prevent double submission
    e.target.querySelector('button[type="submit"]').disabled = true;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const response = await axios.post(
        "http://localhost:8000/api/notices/create/",
        {
          title,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Notice added successfully!");
      setTitle("");
      setContent("");
      document.getElementById("notice-modal").classList.add("hidden");
      setNewNoticeAdded((prev) => !prev);
    } catch (error) {
      setError("Failed to add notice. Make sure you are a committee member.");
    } finally {
      // Enable the submit button after the request is complete
      e.target.querySelector('button[type="submit"]').disabled = false;
    }
  };

  const handleRemoveNotice = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      await axios.delete(`http://localhost:8000/api/notices/${id}/delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotices(notices.filter((notice) => notice.id !== id));
      setSuccess("Notice deleted successfully!");
    } catch (error) {
      setError("Failed to delete notice.");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-[#E9F1FA] p-28">
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-[#1c5b70]">
              <button
                onClick={() =>
                  document
                    .getElementById("notice-modal")
                    .classList.remove("hidden")
                }
                className="p-2 ml-96 rounded-full bg-[#1c5b70] text-white hover:bg-[#154456] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1c5b70] focus:ring-opacity-50"
                aria-label="Add Notices"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2">
                Add
              </span>
            </h2>
            {/* {error && <p className="text-red-500 mb-4">Error: {error}</p>} */}
            {notices.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {notices.map((notice) => (
                  <li
                    key={notice.id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      <strong>{notice.title}</strong> - {notice.content}
                    </span>
                    <div className="flex space-x-2">
                      <div className="relative group"></div>
                      <div className="relative group">
                        <button
                          onClick={() => handleRemoveNotice(notice.id)}
                          className="p-2 rounded-full bg-[#1c5b70] text-white hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          aria-label="Remove notices"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 right-0 bottom-full mb-2">
                          Remove
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No notices found. </p>
            )}
            {/* <div className="mt-8">
              <button
                onClick={handleBackToHousehold}
                className="w-full bg-[#1c5b70] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Back to Household
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
      {/* Modal */}
      <div
        id="notice-modal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden flex justify-center items-center"
      >
        <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-4">
              Add New Notice
            </h3>
            <form onSubmit={handleAddNotice} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content:
                </label>
                <input
                  type="text"
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="w-24 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1c5b70] text-base font-medium text-white hover:bg-[#154456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5b70]"
                >
                  Add Notice
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("notice-modal")
                      .classList.add("hidden")
                  }
                  className="w-24 justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5b70]"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noticeboard;
