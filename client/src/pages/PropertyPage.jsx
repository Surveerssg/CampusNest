import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPropertyById, createBooking } from '../services/mockDataService';

export default function PropertyPage() {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const [property, setProperty] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    numberOfGuests: 1,
    name: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const loadProperty = async () => {
      const propertyData = await getPropertyById(id);
      setProperty(propertyData);
    };
    loadProperty();
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-slate-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </div>
      </div>
    );
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (!isStudent()) {
      alert('Please login as a student to make a booking');
      return;
    }
    setLoading(true);
    try {
      await createBooking({
        ...booking,
        propertyId: id,
        userId: user.id
      });
      alert('Booking request sent successfully!');
      setBooking({
        checkIn: '',
        checkOut: '',
        numberOfGuests: 1,
        name: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-slate-900 text-slate-100 min-h-screen z-50 overflow-y-auto">
        <div className="bg-slate-900 p-8">
          <div className="mb-8">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="fixed right-8 top-8 flex items-center gap-2 py-3 px-6 rounded-2xl shadow-xl bg-slate-800/90 backdrop-blur-sm text-slate-100 border border-slate-700/50 hover:bg-slate-700/90 hover:border-slate-600/70 transition-all duration-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close photos
            </button>
          </div>
          <div className="grid gap-6 max-w-6xl mx-auto">
            {property.images?.length > 0 && property.images.map((photo, index) => (
              <div key={index} className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
                <img src={photo} alt={`${property.title} photo ${index + 1}`} className="w-full h-auto object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800"></div>
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-slate-700/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-slate-600/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Property Header */}
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-700/10 via-slate-600/10 to-slate-700/10"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-slate-100 mb-4">{property.title}</h1>
              <div className="flex items-center gap-3 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="font-medium text-lg">{property.address}</span>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-8">
            {property.images?.slice(0, 3).map((img, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                onClick={() => setShowAllPhotos(true)}
              >
                <img
                  src={img}
                  alt={`${property.title} photo ${idx + 1}`}
                  className="w-full h-64 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-slate-800/80 backdrop-blur-sm rounded-full p-3 border border-slate-600/50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-slate-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr]">
            {/* Left Column - Property Details */}
            <div className="space-y-8">
              {/* Description */}
              <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-700/10 via-slate-600/10 to-slate-700/10"></div>
                <div className="relative z-10">
                  <h2 className="font-bold text-2xl text-slate-100 mb-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    Description
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-lg">{property.description}</p>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-700/10 via-slate-600/10 to-slate-700/10"></div>
                <div className="relative z-10">
                  <h2 className="font-bold text-2xl text-slate-100 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-200">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    </div>
                    Property Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Type', value: property.type },
                      { label: 'Occupancy', value: property.occupancy },
                      { label: 'Room Type', value: property.roomType },
                      { label: 'Lease Term', value: property.leaseTerm },
                      { label: 'Max Guests', value: property.maxGuests },
                      { label: 'Price', value: `₹${property.price} per ${property.leaseTerm}` }
                    ].map((detail, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600/30">
                        <span className="text-slate-400 text-sm font-medium block mb-1">{detail.label}</span>
                        <span className="text-slate-200 font-semibold text-lg">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-700/10 via-slate-600/10 to-slate-700/10"></div>
                  <div className="relative z-10">
                    <h2 className="font-bold text-2xl text-slate-100 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-200">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      Amenities
                    </h2>
                    <div className="flex flex-wrap gap-3">
                      {property.amenities.map(perk => (
                        <span key={perk} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-700/50 text-slate-200 font-medium border border-slate-600/50 hover:bg-slate-600/50 hover:border-slate-500/70 transition-all duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Extra Info */}
              {property.extraInfo && (
                <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-700/10 via-slate-600/10 to-slate-700/10"></div>
                  <div className="relative z-10">
                    <h2 className="font-bold text-2xl text-slate-100 mb-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-200">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                      </div>
                      Extra Information
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-lg">{property.extraInfo}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-slate-700/10 via-slate-600/10 to-slate-700/10"></div>
                <div className="relative z-10">
                  {/* Price Display */}
                  <div className="text-center mb-8 p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30">
                    <div className="text-3xl font-bold text-slate-100 mb-2">₹{property.price}</div>
                    <div className="text-slate-400 text-lg">per {property.leaseTerm}</div>
                  </div>

                  {isStudent() && (
                    <form onSubmit={handleSubmitBooking} className="space-y-6">
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold text-slate-100">Book this place</h3>
                        <p className="text-slate-400 mt-1">Fill out the details below</p>
                      </div>

                      {/* Form Fields */}
                      {[
                        { name: 'checkIn', label: 'Check-in', type: 'date' },
                        { name: 'checkOut', label: 'Check-out', type: 'date' },
                        { name: 'numberOfGuests', label: 'Number of guests', type: 'number', min: 1, max: property.maxGuests },
                        { name: 'name', label: 'Your full name', type: 'text', placeholder: 'John Doe' },
                        { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+91 1234567890' }
                      ].map((field) => (
                        <div key={field.name}>
                          <label className="block text-slate-300 mb-3 font-medium" htmlFor={field.name}>
                            {field.label}
                          </label>
                          <input
                            id={field.name}
                            type={field.type}
                            name={field.name}
                            value={booking[field.name]}
                            onChange={handleBookingChange}
                            placeholder={field.placeholder}
                            min={field.min}
                            max={field.max}
                            className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 disabled:opacity-50 disabled:bg-slate-700/30"
                            disabled={loading}
                            required
                          />
                        </div>
                      ))}

                      {/* Message Field */}
                      <div>
                        <label className="block text-slate-300 mb-3 font-medium" htmlFor="message">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={booking.message}
                          onChange={handleBookingChange}
                          placeholder="Tell us about your requirements..."
                          rows="4"
                          className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-slate-700/70 transition-all duration-300 resize-none disabled:opacity-50 disabled:bg-slate-700/30"
                          disabled={loading}
                        />
                      </div>

                      {/* Submit Button */}
                      <button 
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl text-slate-100 font-bold text-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-500 transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 border border-slate-600/50"
                        disabled={loading}
                      >
                        <span className="relative z-10">
                          {loading ? 'Booking...' : 'Book this place'}
                        </span>
                      </button>
                    </form>
                  )}

                  {!isStudent() && (
                    <div className="text-center">
                      <div className="mb-6 p-6 bg-slate-700/30 rounded-2xl border border-slate-600/30">
                        <div className="text-xl font-bold text-slate-100 mb-2">Want to book?</div>
                        <div className="text-slate-400">Please login as a student to continue</div>
                      </div>
                      <Link 
                        to="/login" 
                        className="block w-full py-4 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl text-slate-100 font-bold text-lg shadow-lg hover:shadow-xl hover:from-slate-600 hover:to-slate-500 transform hover:-translate-y-0.5 transition-all duration-300 border border-slate-600/50"
                      >
                        Login to book
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}