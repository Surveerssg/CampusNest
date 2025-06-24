import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLandlordProperties, deleteProperty } from '../services/mockDataService';
import { Link, useNavigate } from 'react-router-dom';

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProperties(getLandlordProperties(user.id));
    }
  }, [user]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty(id);
      setProperties(getLandlordProperties(user.id));
    }
  };

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold text-primary-blue mb-6">Owner Dashboard</h1>

      <div className="mb-6 flex justify-between items-center">
        <span className="text-lg text-gray-700">Welcome, {user?.name}!</span>
        <Link to="/account/properties/new" className="btn-primary">Add New Listing</Link>
      </div>

      <h2 className="text-xl font-semibold text-primary-blue mb-4">My Listings</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {properties.length === 0 && (
          <div className="text-gray-500 col-span-full">
            No listings yet. Click 'Add New Listing' to get started.
          </div>
        )}
        {properties.map(property => (
          <div key={property.id} className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex flex-col">
            {property.images?.[0] && (
              <img
                src={property.images[0]}
                alt={property.title}
                className="rounded-lg object-cover w-full h-40 mb-3"
              />
            )}
            <h3 className="font-bold text-lg text-primary-blue mb-1">{property.title}</h3>
            <div className="text-gray-600 text-sm mb-2">{property.address}</div>
            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => navigate(`/account/properties/${property.id}`)}
                className="btn-secondary"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
