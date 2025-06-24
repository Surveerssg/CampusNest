import {useContext, useEffect, useState} from "react";
import {differenceInCalendarDays} from "date-fns";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "./UserContext.jsx";

export default function BookingWidget({place}) {
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [name,setName] = useState('');
  const [phone,setPhone] = useState('');
  const [redirect,setRedirect] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookThisPlace() {
    if (!user) {
      setError('Please log in to book this place');
      return;
    }
    if (!checkIn || !checkOut || !numberOfGuests || !name || !phone) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const response = await axios.post('/api/bookings', {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place:place._id,
        price:numberOfNights * place.price,
      });
      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book place');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />
  }

  return (
    <div className="bg-glass-medium shadow-glass-shadow p-6 rounded-3xl border border-holo-border backdrop-blur-strong text-text-primary">
      <div className="text-3xl text-center font-bold mb-4 text-neon-cyan">
        Warp Cost: <span className="text-neon-green">${place.price}</span> / per cycle
      </div>
      <div className="border border-holo-border rounded-2xl mt-4 overflow-hidden bg-void-purple">
        <div className="flex border-b border-holo-border">
          <div className="py-3 px-4 flex-1">
            <label className="block text-text-secondary text-sm font-medium mb-1">Arrival Date:</label>
            <input 
              type="date"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)}
              className="input-style"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="py-3 px-4 border-l border-holo-border flex-1">
            <label className="block text-text-secondary text-sm font-medium mb-1">Departure Date:</label>
            <input 
              type="date" 
              value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)}
              className="input-style"
              min={checkIn || new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t border-holo-border">
          <label className="block text-text-secondary text-sm font-medium mb-1">Number of Crew Members:</label>
          <input 
            type="number"
            value={numberOfGuests}
            onChange={ev => setNumberOfGuests(ev.target.value)}
            min="1"
            max={place.maxGuests}
            className="input-style"
          />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t border-holo-border space-y-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-1">Your Stellar Name:</label>
              <input 
                type="text"
                value={name}
                onChange={ev => setName(ev.target.value)}
                className="input-style"
                placeholder="Commander Shepard"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-1">Intercom Frequency:</label>
              <input 
                type="tel"
                value={phone}
                onChange={ev => setPhone(ev.target.value)}
                className="input-style"
                placeholder="0123-456-7890"
              />
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="error-message mt-4">
          {error}
        </div>
      )}
      <button 
        onClick={bookThisPlace} 
        className="auth-button mt-6 w-full"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loading-spinner !w-5 !h-5 mr-2"></div>
            Initiating Warp Jump...
          </div>
        ) : (
          <>
            Book This Cosmic Journey
            {numberOfNights > 0 && (
              <span className="ml-2"> ${numberOfNights * place.price}</span>
            )}
          </>
        )}
      </button>
      {!user && (
        <div className="text-center text-text-secondary text-sm mt-4">
          Please log in to book this cosmic destination.
        </div>
      )}
    </div>
  );
}