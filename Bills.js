import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
const Bills = () => {
  const [resident, setResident] = useState([]);
  const [bills, setBills] = useState([]);
  const [success, setSuccess] = useState([]);
  const [error, setError] = useState(null);
  const [newBillsAdded, setNewBillAdded] = useState(false);
  const [formData, setFormData] = useState({
    billType: "",
    amount: "",
    description: "",
    dueDate: "",
  });
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

  // useEffect(() => {
  //     const fetchBills = async () => {
  //         const token = localStorage.getItem('access_token');
  //         try {
  //             const response = await axios.get('http://localhost:8000/api/viewBills/', {
  //                 headers: { Authorization: `Bearer ${token}` }
  //             });
  //             setBills(response.data);
  //         } catch (error) {
  //             setError('Error fetching bills.');
  //         }
  //     };

  //     fetchBills();
  // }, [resident]);

  // const handleRemoveBill = async (id) => {
  //     const token = localStorage.getItem('access_token');
  //     try {
  //         await axios.delete(`http://localhost:8000/api/deleteBill/${id}/`, {
  //             headers: { Authorization: `Bearer ${token}` }
  //         });
  //         setMessage('Bill deleted successfully.');
  //         setBills(bills.filter(bill => bill.id !== id));
  //     } catch (error) {
  //         setMessage('Error deleting bill.');
  //     }
  // };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          "http://localhost:8000/api/viewBills/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBills(response.data);
      } catch (error) {
        setError("Failed to fetch bills.");
      }
    };

    fetchBills();
  }, [resident, formData, newBillsAdded]);

  const handleAddBill = async (e) => {
    e.preventDefault();
    // Disable the submit button to prevent double submission
    e.target.querySelector('button[type="submit"]').disabled = true;
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:8000/api/addBill/",
        {
          bill_type: formData.billType,
          amount: formData.amount,
          description: formData.description,
          due_date: formData.dueDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Bill added successfully!");
      setError(null);
      document.getElementById("bill-modal").classList.add("hidden");
      setNewBillAdded((prev) => !prev);
      // Clear the form
      setFormData({
        billType: "",
        amount: "",
        description: "",
        dueDate: "",
      });
    } catch (err) {
      setError("Failed to add bill.");
      setSuccess(null);
    } finally {
      // Enable the submit button after the request is complete
      e.target.querySelector('button[type="submit"]').disabled = false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRemoveBill = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/deleteBill/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBills(bills.filter((bill) => bill.id !== id));
      setSuccess("Bill deleted successfully!");
      setError(null);
    } catch (error) {
      setError("Failed to delete bill.");
    }
  };
  const backPage = () => {
    navigate("/bills");
  };
  // const handleViewHelper = () => {
  //     navigate('/viewHelper');
  // };

  const handleBackToHousehold = () => {
    navigate("/committee_household");
  };

  return (
    <div>
      <div className="min-h-screen bg-[#E9F1FA] p-28">
        <Navbar />
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6 text-[#1c5b70]">
              Bills to add for {resident.name}
              <button
                onClick={() =>
                  document
                    .getElementById("bill-modal")
                    .classList.remove("hidden")
                }
                className="p-2 ml-96 rounded-full bg-[#1c5b70] text-white hover:bg-[#154456] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#1c5b70] focus:ring-opacity-50"
                aria-label="Add Pet"
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
            {bills.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {bills.map((bill) => (
                  <li
                    key={bill.id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-md"
                  >
                    <span className="text-xl font-semibold text-gray-800">
                      {bill.bill_type} - ₹{bill.amount} (Due: {bill.due_date})
                    </span>
                    <div className="flex space-x-2">
                      <div className="relative group"></div>
                      <div className="relative group">
                        <button
                          onClick={() => handleRemoveBill(bill.id)}
                          className="p-2 rounded-full bg-[#1c5b70] text-white hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          aria-label="Remove bill"
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
              <p>No bills found. </p>
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
        id="bill-modal"
        className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden flex justify-center items-center"
      >
        <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="mt-3">
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-4">
              Add New Bill
            </h3>
            <form onSubmit={handleAddBill} className="space-y-4">
              <div>
                <label
                  htmlFor="billType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bill Type:
                </label>
                <input
                  type="text"
                  name="billType"
                  value={formData.billType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount:
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description:
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date:
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1c5b70] focus:border-[#1c5b70]"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="w-24 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#1c5b70] text-base font-medium text-white hover:bg-[#154456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5b70]"
                >
                  Add Bills
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("bill-modal")
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

export default Bills;
