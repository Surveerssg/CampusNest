import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "../Image";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/bookings")
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to load bookings");
        console.error("Error loading bookings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  return (
    <div>
      <AccountNav />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-text-primary">
        {bookings.length === 0 ? (
          <div className="text-center text-holo-silver py-12">
            <h2 className="text-2xl font-semibold mb-2">No trips booked yet</h2>
            <p className="mt-2 text-lg">Start exploring and book your next adventure!</p>
            <Link to={'/'} className="mt-6 inline-block text-lg text-neon-cyan hover:underline">
              Browse accommodations
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <Link
                key={booking._id}
                to={`/account/bookings/${booking._id}`}
                className="flex flex-col md:flex-row gap-4 bg-glass-medium rounded-2xl overflow-hidden shadow-glass-shadow border border-holo-border hover:shadow-neon-glow-cyan transition-shadow duration-200"
              >
                <div className="w-full md:w-48 h-48 bg-gray-300">
                  {booking.place?.images?.[0] && (
                    <Image
                      className="w-full h-full object-cover"
                      src={booking.place.images[0]}
                      alt="Booking"
                    />
                  )}
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-xl font-semibold">{booking.place?.title || 'Unknown Property'}</h3>
                  <p className="text-sm text-holo-silver">{booking.place?.address || 'No address available'}</p>
                  <div className="mt-2">
                    <BookingDates booking={booking} />
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">Guests:</span> {booking.numberOfGuests}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">Total Price:</span> ₹{booking.price}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">Status:</span> {booking.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
