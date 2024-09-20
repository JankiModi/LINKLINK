import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
const Helpers = () => {
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [success, setSuccess] = useState(null);
  const [resident, setResident] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [error, setError] = useState(null);
  const [newHelperAdded, setNewHelpAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get("http://localhost:8000/api/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setResident(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, []);

  const handleAddHelper = async (e) => {
    e.preventDefault();
    e.target.querySelector('button[type="submit"]').disabled = true;
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }
      const response = await axios.post(
        "http://localhost:8000/api/addHelper/",
        { name, job, phone_number: phoneNumber },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Helper added:", response.data);
      document.getElementById("helper-modal").classList.add("hidden");
      setNewHelpAdded((prev) => !prev);
    } catch (error) {
      console.error("There was an error adding the pet:", error);
      alert(
        "Failed to add helper. Please check your credentials and try again."
      );
    } finally {
      // Enable the submit button after the request is complete
      e.target.querySelector('button[type="submit"]').disabled = false;
    }
  };

  const handleBackToHousehold = () => {
    navigate("/committee_household");
  };

  useEffect(() => {
    const fetchHelpers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }
        const response = await axios.get(
          "http://localhost:8000/api/viewHelpers/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHelpers(response.data);
      } catch (error) {
        setError("Failed to fetch helpers.");
      }
    };

    fetchHelpers();
  }, [resident, newHelperAdded]);

  const handleRemoveHelper = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("No access token found");
      }
      await axios.delete(`http://localhost:8000/api/removeHelper/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHelpers(helpers.filter((helper) => helper.id !== id));
      //   setSuccess("Helper removed successfully!");
    } catch (error) {
      setError("Failed to remove helper.");
    }
  };

  const backPage = () => {
    navigate("/helpers");
  };

  return (
    <div>
      <div className="min-h-screen bg-[#E9F1FA] p-28">
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-[#1c5b70]">
              Helpers of {resident.name}'s House
              <button
                onClick={() =>
                  document
                    .getElementById("helper-modal")
                    .classList.remove("hidden")
                }
                className="p-2 ml-80 rounded-full bg-[#1c5b70] text-white hover:bg-[#154456] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1c5b70] focus:ring-opacity-50"
                aria-label="Add Helper"
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
            {helpers.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {helpers.map((helper) => (
                  <li
                    key={helper.id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      {helper.name} - {helper.job} ({helper.phone_number})
                    </span>
                    <div className="flex space-x-2">
                      <div className="relative group"></div>
                      <div className="relative group">
                        <button
                          onClick={() => handleRemoveHelper(helper.id)}
                          className="p-2 rounded-full bg-[#1c5b70] text-white hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          aria-label="Remove Helper"
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
              <p>No Helpers found. </p>
            )}
            <div className="mt-8">
              <button
                onClick={handleBackToHousehold}
                className="w-full bg-[#1c5b70] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Back to Household
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {/* Modal */}
      <div
        id="helper-modal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden flex justify-center items-center"
      >
        <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-4">
              Add New Helper
            </h3>
            <form onSubmit={handleAddHelper} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div>
                <label
                  htmlFor="job"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job of Helper:
                </label>
                <input
                  type="text"
                  id="job"
                  name="job"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div>
                <label
                  htmlFor="phonenum"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number:
                </label>
                <input
                  type="text"
                  id="phonenum"
                  name="phonenum"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="w-24 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1c5b70] text-base font-medium text-white hover:bg-[#154456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5b70]"
                >
                  Add Helper
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("helper-modal")
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
export default Helpers;
