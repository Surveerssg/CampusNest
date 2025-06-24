import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    location: '',
    amenities: '',
  });

  useEffect(() => {
    Promise.all([
      import('../services/mockDataService').then((m) => m.getAllProperties()),
      axios.get('/api/places'),
    ]).then(([mock, { data: real }]) => {
      const all = [...mock, ...real.filter(p => p.isApproved)];
      // Deduplicate by case-insensitive, trimmed title
      const unique = Array.from(new Map(all.map(item => [item.title.trim().toLowerCase(), item])).values());
      setProperties(unique);
      setFilteredProperties(unique);
    });
  }, []);

  useEffect(() => {
    const filtered = properties.filter((p) => {
      const price = p.price || 0;
      const matchesPriceMin = !filters.priceMin || price >= parseInt(filters.priceMin);
      const matchesPriceMax = !filters.priceMax || price <= parseInt(filters.priceMax);
      const matchesLocation = !filters.location || p.address?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesAmenities = !filters.amenities || (p.amenities || []).join(',').toLowerCase().includes(filters.amenities.toLowerCase());
      return matchesPriceMin && matchesPriceMax && matchesLocation && matchesAmenities;
    });
    setFilteredProperties(filtered);
  }, [filters, properties]);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-12 pt-8">
      <h1 className="text-3xl font-bold text-neon-cyan mb-6">Properties</h1>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <input
          type="number"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
          className="input-style"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
          className="input-style"
        />
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="input-style"
        />
        <input
          type="text"
          placeholder="Amenity (e.g., Wifi, AC)"
          value={filters.amenities}
          onChange={(e) => setFilters({ ...filters, amenities: e.target.value })}
          className="input-style"
        />
      </div>

      {/* Grid of properties */}
      {console.log('Rendering properties:', filteredProperties)}
      <div className="grid gap-x-10 gap-y-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProperties.map((property) => (
          <Link to={'/property/' + property._id} key={property._id} className="block group">
            <div className="bg-glass-medium rounded-2xl shadow-glass-shadow border border-holo-border transition-all duration-200 hover:shadow-elevated hover:border-neon-cyan flex flex-col h-full backdrop-blur-strong">
              {property.photos?.[0] && (
                <img
                  className="rounded-t-2xl object-cover w-full aspect-[4/3]"
                  src={'http://localhost:4000/uploads/' + property.photos[0]}
                  alt={property.title}
                />
              )}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="font-bold text-lg text-neon-cyan group-hover:underline break-words whitespace-normal mb-1">
                  {property.title}
                </h2>
                <h3 className="text-sm text-holo-silver truncate mb-2">{property.address}</h3>
                <div className="mt-auto flex items-center gap-2">
                  <span className="font-bold text-neon-green text-lg">₹{property.price}</span>
                  <span className="text-holo-silver text-sm">per month</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {filteredProperties.length === 0 && (
          <div className="text-gray-500 col-span-full text-center">No properties match your filters.</div>
        )}
      </div>
    </div>
  );
}
