import React, { useState, useEffect } from "react";
import TieLogo from "../images/TieLogo.png"; // Adjust the path as needed
import axios from "axios";

const AddBookingForm = () => {
  const [activeTab, setActiveTab] = useState("Direct");
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(""); // Admin or User
  const [authToken, setAuthToken] = useState(""); // JWT token or other auth mechanism
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Example: Mock function to simulate fetching user details (token + role)
  useEffect(() => {
    // Simulate fetching auth details (Replace this with actual logic)
    const fetchAuthDetails = () => {
      const token = localStorage.getItem("authToken"); // Replace with actual storage
      const role = localStorage.getItem("userRole"); // e.g., "admin" or "user"
      if (token && (role === "admin" || role === "user")) {
        setAuthToken(token);
        setUserRole(role);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        alert("Unauthorized access! Please log in as admin or user.");
      }
    };

    fetchAuthDetails();
  }, []);

  // Fetch all bookings (only if authorized)
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/data/", {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass token for API authorization
          },
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthorized, authToken]);

  // Fetch details for a specific booking
  const fetchBookingDetails = async (bookingId) => {
    if (!isAuthorized) {
      alert("Unauthorized! Please log in.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/data/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSelectedBooking(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  // Delete a booking (Admin only)
  const deleteBooking = async (bookingId) => {
    if (userRole !== "admin") {
      alert("Only admins can delete bookings!");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/data/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      alert("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-4">
        <div>
          <img src={TieLogo} alt="Tie Logo" className="w-12 h-12" />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center">
          <div className="flex border rounded-full overflow-hidden">
            <button
              onClick={() => setActiveTab("Direct")}
              className={`px-8 py-3 text-lg font-medium ${
                activeTab === "Direct"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Direct
            </button>
            <button
              onClick={() => setActiveTab("Channel")}
              className={`px-8 py-3 text-lg font-medium ${
                activeTab === "Channel"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              Channel
            </button>
          </div>
        </div>

        {/* Profile Icon */}
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="57"
            height="57"
            viewBox="0 0 57 57"
            fill="none"
            className="cursor-pointer"
          >
            <circle cx="28.5" cy="28.5" r="28.5" fill="#003B95" />
          </svg>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex w-full max-w-7xl mt-6 gap-6 justify-between mx-auto">
        {/* Left Side: Add Booking Form */}
        <div className="flex-1 p-6 rounded-[12px] bg-white shadow-[0px_4px_31.5px_-6px_rgba(0,0,0,0.25)]">
          <h2 className="text-xl font-bold mb-4 text-black text-center">Add Booking</h2>
          {/* Your booking form code here */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="text"
                placeholder="Mobile No"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="email"
                placeholder="Email ID"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
            </div>
          </div>

          {/* Booking Details */}
          <div >
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Property ID"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="text"
                placeholder="Room Number"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="date"
                placeholder="Check-in Date"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="date"
                placeholder="Check-out Date"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="text"
                placeholder="Room Type"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="number"
                placeholder="No of Rooms"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="text"
                placeholder="Total Pax"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="number"
                placeholder="Tariff"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="number"
                placeholder="Advance Payment"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="text"
                placeholder="Payment Mode"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="text"
                placeholder="Market Segment"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <input
                type="text"
                placeholder="Business Source"
                className="p-3 border rounded-lg bg-[#E6E6E6]"
              />
              <textarea
                placeholder="Special Instructions"
                className="p-3 border rounded-lg col-span-2 resize-none bg-[#E6E6E6]"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg">
              Add
            </button>
            <button className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg">
              Discard
            </button>
          </div>
        </div>
        </div>

        {/* Right Side: Booking Details */}
        <div className="flex-1 p-6 rounded-[12px] bg-white shadow-[0px_4px_31.5px_-6px_rgba(0,0,0,0.25)]">
          <h2 className="text-xl font-bold mb-4 text-black">Booking Details</h2>

          {/* Booking Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b">Property ID</th>
                    <th className="px-4 py-2 border-b">Booking ID</th>
                    <th className="px-4 py-2 border-b">Customer Name</th>
                    <th className="px-4 py-2 border-b">Mobile No</th>
                    <th className="px-4 py-2 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-4 py-2 border-b">{booking.propertyId}</td>
                      <td className="px-4 py-2 border-b">{booking.id}</td>
                      <td className="px-4 py-2 border-b">{booking.customerName}</td>
                      <td className="px-4 py-2 border-b">{booking.mobileNo}</td>
                      <td className="px-4 py-2 border-b flex gap-2">
                        <button
                          onClick={() => fetchBookingDetails(booking.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookingForm;
