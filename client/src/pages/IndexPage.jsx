import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getAllProperties } from '../services/mockDataService';

export default function IndexPage() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    occupancy: '',
    roomType: '',
    leaseTerm: '',
    amenities: []
  });

  useEffect(() => {
    const loadProperties = async () => {
      const mockProperties = await getAllProperties();
      const realResponse = await axios.get('/api/places');
      const approvedRealProperties = realResponse.data.filter(p => p.status === 'approved');
      const allProperties = [...mockProperties, ...approvedRealProperties];
      setProperties(allProperties);
    };
    loadProperties();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const displayedProperties = properties.filter(property => {
    const {
      search, type, occupancy, roomType, leaseTerm,
      minPrice, maxPrice, minRating, amenities
    } = filters;

    const matchesSearch = property.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = !type || property.type === type;
    const matchesOccupancy = !occupancy || property.occupancy === occupancy;
    const matchesRoomType = !roomType || property.roomType === roomType;
    const matchesLeaseTerm = !leaseTerm || property.leaseTerm === leaseTerm;
    const matchesMinPrice = !minPrice || property.price >= parseInt(minPrice);
    const matchesMaxPrice = !maxPrice || property.price <= parseInt(maxPrice);
    const matchesMinRating = !minRating || property.rating >= parseFloat(minRating);
    const matchesAmenities = amenities.every(a => (property.amenities || []).includes(a));

    return (
      matchesSearch &&
      matchesType &&
      matchesOccupancy &&
      matchesRoomType &&
      matchesLeaseTerm &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesMinRating &&
      matchesAmenities
    );
  });

  return (
    <div className="mt-8 max-w-7xl mx-auto px-4">
      {/* Filters Section */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          placeholder="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          className="input-style"
        />
        <select name="type" value={filters.type} onChange={handleFilterChange} className="input-style select-dark">
          <option value="">All Types</option>
          <option value="pg">PG</option>
          <option value="flat">Flat</option>
        </select>
        <select name="occupancy" value={filters.occupancy} onChange={handleFilterChange} className="input-style select-dark">
          <option value="">All Occupancy</option>
          <option value="boys">Boys</option>
          <option value="girls">Girls</option>
          <option value="co-ed">Co-ed</option>
        </select>
        <select name="roomType" value={filters.roomType} onChange={handleFilterChange} className="input-style select-dark">
          <option value="">All Room Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="sharing">Sharing</option>
        </select>
        <select name="leaseTerm" value={filters.leaseTerm} onChange={handleFilterChange} className="input-style select-dark">
          <option value="">All Terms</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input
          type="number"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleFilterChange}
          placeholder="Min Price"
          className="input-style"
        />
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleFilterChange}
          placeholder="Max Price"
          className="input-style"
        />
        <input
          type="number"
          name="minRating"
          value={filters.minRating}
          onChange={handleFilterChange}
          placeholder="Min Rating"
          step="0.1"
          min="0"
          max="5"
          className="input-style"
        />
      </div>

      {/* Amenity checkboxes */}
      <div className="mb-6 flex flex-wrap gap-4">
        {['WiFi', 'AC', 'TV', 'Fridge', 'Laundry', 'Geyser'].map((a) => (
          <label key={a} className="flex items-center gap-2 text-sm text-holo-silver">
            <input
              type="checkbox"
              checked={filters.amenities.includes(a)}
              onChange={() => handleAmenityChange(a)}
            />
            {a}
          </label>
        ))}
      </div>

      {/* Listings */}
      <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {displayedProperties.length > 0 ? (
          displayedProperties.map((property) => {
            const uniqueKey = property.id || property._id || property.title;
            return (
              <Link to={`/property/${uniqueKey}`} key={uniqueKey}>
                <div className="bg-glass-medium rounded-2xl overflow-hidden shadow border border-holo-border">
                  {property.images?.[0] && (
                    <img
                      className="w-full aspect-square object-cover"
                      src={property.images[0]}
                      alt={property.title}
                    />
                  )}
                  <div className="p-4">
                    <h2 className="font-bold text-lg text-neon-cyan">{property.title}</h2>
                    <h3 className="text-sm text-holo-silver">{property.address}</h3>
                    <div className="mt-1 font-bold text-neon-green">₹{property.price} / {property.leaseTerm}</div>
                    <div className="text-sm text-holo-silver">{property.occupancy} • {property.roomType}</div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-holo-silver text-center col-span-full">No properties match your filters.</div>
        )}
      </div>
    </div>
  );
}
