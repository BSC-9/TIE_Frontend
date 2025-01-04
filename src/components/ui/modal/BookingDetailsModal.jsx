import React, { useState, useEffect } from "react";

const BookingDetailsModal = ({ isOpen, onClose, selectedBooking }) => {
  // Initialize state for form data
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Update formData whenever selectedBooking changes
  useEffect(() => {
    if (selectedBooking) {
      setFormData(selectedBooking.data || {});
    }
  }, [selectedBooking]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    // Retrieve the token from localStorage
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Authorization token is missing. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/data/${formData.booking_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`, // Include the token in the headers
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Booking updated successfully!");
        console.log("Response:", result);
        setIsEditing(false); // Exit editing mode
      } else {
        alert(`Error: ${result.message || "Failed to update booking."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred while updating booking.");
    }
  };

  if (!isOpen || !selectedBooking) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[500px] shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Booking Details</h2>
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="font-bold block mb-1">{key.replace(/_/g, " ")}:</label>
              {isEditing ? (
                <input
                  type="text"
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded px-2 py-1"
                />
              ) : (
                <p className="bg-gray-100 px-2 py-1 rounded">{formData[key]}</p>
              )}
            </div>
          ))}
        </div>
        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              className="mt-4 mr-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 mr-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit
          </button>
        )}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsModal;
