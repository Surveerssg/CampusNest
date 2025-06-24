import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import AccountNav from "../AccountNav";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const { user, isStudent, isLandlord } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${id}`);
        setBooking(response.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.patch(`/api/bookings/${id}`, { status: newStatus });
      setBooking((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update booking status");
    }
  };

  if (loading) {
    return (
      <div>
        <AccountNav />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AccountNav />
        <div className="flex items-center justify-center min-h-[50vh] text-text-accent-pink">
          <span className="text-lg font-semibold">Error: {error}</span>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div>
        <AccountNav />
        <div className="flex items-center justify-center min-h-[50vh] text-text-accent-pink">
          <span className="text-lg font-semibold">Booking not found</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AccountNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-text-primary">
        <h1 className="text-3xl font-bold mb-6">Booking Details</h1>
        <div className="bg-glass-medium rounded-2xl p-6 shadow-glass-shadow border border-holo-border">
          <h2 className="text-2xl font-semibold mb-4">{booking.place?.title || "Unknown Property"}</h2>
          <p className="text-holo-silver mb-4">{booking.place?.address || "No address available"}</p>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Booking Information</h3>
            <BookingDates booking={booking} />
            <p>Number of Guests: {booking.numberOfGuests}</p>
            <p>Total Price: ₹{booking.price}</p>
            <p>Status: <span className="font-semibold capitalize">{booking.status}</span></p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Guest Information</h3>
            <p>Name: {booking.name}</p>
            <p>Phone: {booking.phone}</p>
          </div>
          <div className="flex gap-4">
            {isStudent() && booking.status === "pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("cancelled")}
                  className="py-2 px-4 bg-red-500 text-white rounded-full"
                >
                  Cancel Booking
                </button>
                <button
                  onClick={() => handleStatusUpdate("modified")}
                  className="py-2 px-4 bg-yellow-500 text-white rounded-full"
                >
                  Modify Booking
                </button>
              </>
            )}
            {isLandlord() && booking.status === "pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate("approved")}
                  className="py-2 px-4 bg-green-500 text-white rounded-full"
                >
                  Approve Booking
                </button>
                <button
                  onClick={() => handleStatusUpdate("rejected")}
                  className="py-2 px-4 bg-red-500 text-white rounded-full"
                >
                  Reject Booking
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
