import React, { useState, useEffect } from "react";
import TieLogo from "../images/TieLogo.png"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";
import BookingDetailsModal from "./modal/BookingDetailsModal";

const UserDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Direct"); // Added activeTab for tab control
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState(""); // Name input
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [formData, setFormData] = useState({
        customer_name: "",
        mobile_no: "",
        email_id: "",
        property_id: "",
        room_number: "",
        check_in_date: "",
        check_out_date: "",
        room_type: "",
        no_of_rooms: "",
        total_pax: "",
        tariff: "",
        advance_payment: "",
        payment_mode: "",
        market_segment: "",
        business_source: "",
        special_instructions: "",
        booking_id: "unique_booking_id",
        status: "", // you can generate unique ID or pass a static one
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve auth token from localStorage (or wherever it's stored)
        const authToken = localStorage.getItem('authToken'); // Replace this with how you're storing it

        try {
            const response = await fetch("http://localhost:3001/api/data/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`, // Include the token in the headers
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Booking added successfully!");
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            alert("Error occurred while adding booking.");
        }
    };


    // Fetch all bookings
    useEffect(() => {
        const fetchBookings = async () => {
            const authToken = localStorage.getItem("authToken");

            if (!authToken) {
                console.log("No token found, redirecting to login...");
                navigate("/login"); // Redirect to login if no token is found
                return;
            }

            setLoading(true);
            try {
                const response = await fetch("http://localhost:3001/api/data/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`, // Use the token retrieved from localStorage
                    },
                });

                const data = await response.json();

                if (data.data && Array.isArray(data.data)) {
                    setBookings(data.data); // Update the state with the bookings data
                } else {
                    console.error("API response does not contain valid booking data", data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings(); // Call the async function inside useEffect
    }, [navigate]);

    const handleLogout = () => {
        // Clear user data (e.g., tokens)
        localStorage.removeItem("authToken"); // Clear token or any other user data
        sessionStorage.clear(); // Optionally clear session storage as well

        // Redirect to login page
        navigate("/login");
    };

    // Fetch details for a specific booking
    const fetchBookingDetails = async (bookingId) => {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            console.error("No token found, unable to fetch booking details.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/api/data/${bookingId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                console.error("Failed to fetch booking details:", response.statusText);
                return;
            }

            const data = await response.json();
            console.log("Booking details:", data);  // Ensure the data is correct

            if (data) {
                setSelectedBooking(data);
                setIsModalOpen(true); // Update the state
                console.log("Selected Booking state updated:", data);  // Verify state is updated
            } else {
                console.error("API response does not contain expected data", data);
            }
        } catch (error) {
            console.error("Error fetching booking details:", error);
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
                            className={`px-8 py-3 text-lg font-medium ${activeTab === "Direct"
                                ? "bg-blue-700 text-white"
                                : "bg-gray-200 text-black"
                                }`}
                        >
                            Direct
                        </button>
                        <button
                            onClick={() => setActiveTab("Channel")}
                            className={`px-8 py-3 text-lg font-medium ${activeTab === "Channel"
                                ? "bg-blue-700 text-white"
                                : "bg-gray-200 text-black"
                                }`}
                        >
                            Channel
                        </button>
                    </div>
                </div>

                {/* Profile Icon */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>

            {/* Main content area */}
            <div className="flex w-full max-w-7xl mt-6 gap-6 justify-between mx-auto">
                {/* Left Side: Add Booking Form */}
                <div className="flex-1 p-6 rounded-[12px] bg-white shadow-[0px_4px_31.5px_-6px_rgba(0,0,0,0.25)]">
                    <h2 className="text-xl font-bold mb-4 text-black text-center">Add Booking</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Customer Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Customer Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleChange}
                                    placeholder="Customer Name"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="text"
                                    name="mobile_no"
                                    value={formData.mobile_no}
                                    onChange={handleChange}
                                    placeholder="Mobile No"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="email"
                                    name="email_id"
                                    value={formData.email_id}
                                    onChange={handleChange}
                                    placeholder="Email ID"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Booking Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="property_id"
                                    value={formData.property_id}
                                    onChange={handleChange}
                                    placeholder="Property ID"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="text"
                                    name="room_number"
                                    value={formData.room_number}
                                    onChange={handleChange}
                                    placeholder="Room Number"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="date"
                                    name="check_in_date"
                                    value={formData.check_in_date}
                                    onChange={handleChange}
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="date"
                                    name="check_out_date"
                                    value={formData.check_out_date}
                                    onChange={handleChange}
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <select
                                    name="room_type"
                                    value={formData.room_type}
                                    onChange={handleChange}
                                    className="p-3 border rounded-lg bg-[#E6E6E6] w-full"
                                >
                                    <option value="" disabled>
                                        Select Room Type
                                    </option>
                                    <option value="Deluxe Double room">Deluxe Double room</option>
                                    <option value="Deluxe Triple room">Deluxe Triple room</option>
                                    <option value="Family room">Family room</option>
                                    <option value="2bedroom apartment">2bedroom apartment</option>
                                    <option value="3bedroom apartment">3bedroom apartment</option>
                                    <option value="2bedroom villa">2bedroom villa</option>
                                    <option value="3bedroom villa">3bedroom villa</option>
                                    <option value="4bedroom villa">4bedroom villa</option>
                                    <option value="7bedroom villa">7bedroom villa</option>
                                    <option value="1bedroom apartment">1bedroom apartment</option>
                                    <option value="Studio apartment">Studio apartment</option>
                                    <option value="Double room with terrace">Double room with terrace</option>
                                    <option value="Standard Double room">Standard Double room</option>
                                    <option value="Standard triple room">Standard triple room</option>
                                </select>

                                <input
                                    type="number"
                                    name="no_of_rooms"
                                    value={formData.no_of_rooms}
                                    onChange={handleChange}
                                    placeholder="No of Rooms"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="text"
                                    name="total_pax"
                                    value={formData.total_pax}
                                    onChange={handleChange}
                                    placeholder="Total Pax"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="number"
                                    name="tariff"
                                    value={formData.tariff}
                                    onChange={handleChange}
                                    placeholder="Tariff"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="number"
                                    name="advance_payment"
                                    value={formData.advance_payment}
                                    onChange={handleChange}
                                    placeholder="Advance Payment"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <select
                                    name="payment_mode"
                                    value={formData.payment_mode}
                                    onChange={handleChange}
                                    className="p-3 border rounded-lg bg-[#E6E6E6] w-full"
                                >
                                    <option value="" disabled>
                                        Select Payment Mode
                                    </option>
                                    <option value="Upi">Upi</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Go-Mmt">Go-Mmt</option>
                                    <option value="Agoda">Agoda</option>
                                    <option value="Not Paid">Not Paid</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Card">Card</option>
                                    <option value="Statflexi">Statflexi</option>
                                </select>

                                <input
                                    type="text"
                                    name="market_segment"
                                    value={formData.market_segment}
                                    onChange={handleChange}
                                    placeholder="Market Segment"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                <input
                                    type="text"
                                    name="business_source"
                                    value={formData.business_source}
                                    onChange={handleChange}
                                    placeholder="Business Source"
                                    className="p-3 border rounded-lg bg-[#E6E6E6]"
                                />
                                {/* Status Dropdown */}
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="status">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                    </select>
                                </div>
                                <textarea
                                    name="special_instructions"
                                    value={formData.special_instructions}
                                    onChange={handleChange}
                                    placeholder="Special Instructions"
                                    className="p-3 border rounded-lg col-span-2 resize-none bg-[#E6E6E6]"
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-700 text-white font-medium rounded-lg"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                className="px-6 py-2 bg-gray-300 text-gray-700 font-medium rounded-lg"
                            >
                                Discard
                            </button>
                        </div>
                    </form>
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
                                        <th className="px-4 py-2 border-b">Customer Name</th>
                                        <th className="px-4 py-2 border-b">Room Type</th>
                                        <th className="px-4 py-2 border-b">Check-In</th>
                                        <th className="px-4 py-2 border-b">Check-Out</th>
                                        <th className="px-4 py-2 border-b">Days</th>
                                        <th className="px-4 py-2 border-b">Remaining Payment</th>
                                        <th className="px-4 py-2 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map((booking) => {
                                        const checkInDate = new Date(booking.check_in_date);
                                        const checkOutDate = new Date(booking.check_out_date);
                                        const days =
                                            (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24); // Calculate days
                                        const remainingPayment =
                                            booking.tariff - booking.advance_payment; // Calculate remaining payment

                                        return (
                                            <tr key={booking.booking_id}>
                                                <td className="px-4 py-2 border-b">{booking.customer_name}</td>
                                                <td className="px-4 py-2 border-b">{booking.room_type}</td>
                                                <td className="px-4 py-2 border-b">{booking.check_in_date}</td>
                                                <td className="px-4 py-2 border-b">{booking.check_out_date}</td>
                                                <td className="px-4 py-2 border-b">{days}</td>
                                                <td className="px-4 py-2 border-b">₹{remainingPayment}</td>
                                                <td className="px-4 py-2 border-b">
                                                    {/* Add View and Delete Buttons here */}
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => fetchBookingDetails(booking.booking_id)}
                                                            className="px-2 py-1 bg-green-600 text-white rounded"
                                                        >
                                                            View
                                                        </button>

                                                        <BookingDetailsModal
                                                            isOpen={isModalOpen}
                                                            onClose={() => setIsModalOpen(false)}
                                                            selectedBooking={selectedBooking}
                                                        />

                                                    </div>

                                                </td>
                                            </tr>
                                        );
                                    })}

                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
