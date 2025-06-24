import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/api/places/user").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link
          to="/account/places/new"
          className="bg-neon-green text-black px-4 py-2 rounded-lg font-medium hover:bg-green-400 transition"
        >
          + Add New Property
        </Link>
      </div>

      {places.length === 0 ? (
        <p className="text-holo-silver">You haven’t added any listings yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {places.map((place) => (
            <Link
              to={`/account/places/${place._id}`}
              key={place._id}
              className="bg-glass-medium rounded-xl overflow-hidden border border-holo-border shadow hover:shadow-lg transition"
            >
              {place.photos?.[0] && (
                <img
                  src={place.photos[0]}
                  alt={place.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-neon-cyan mb-1">
                  {place.title}
                </h2>
                <p className="text-sm text-holo-silver mb-2">{place.address}</p>
                <div className="flex justify-between items-center">
                  <span className="text-neon-green font-medium">
                    ₹{place.price} / {place.leaseTerm}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      place.status === "approved"
                        ? "bg-green-700 text-green-100"
                        : "bg-yellow-700 text-yellow-100"
                    }`}
                  >
                    {place.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
