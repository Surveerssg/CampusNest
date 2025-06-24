export default function Amenities({ selected = [], onChange }) {
    const allAmenities = ['WiFi', 'AC', 'TV', 'Fridge', 'Laundry', 'Geyser'];
  
    const handleToggle = (amenity) => {
      if (selected.includes(amenity)) {
        onChange(selected.filter(a => a !== amenity));
      } else {
        onChange([...selected, amenity]);
      }
    };
  
    return (
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {allAmenities.map(amenity => (
          <label
            key={amenity}
            className={`flex items-center gap-2 px-3 py-2 rounded-2xl cursor-pointer border transition ${
              selected.includes(amenity)
                ? 'bg-gradient-secondary-btn text-white border-neon-green'
                : 'bg-glass-dark border-holo-border text-holo-silver hover:border-neon-cyan'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(amenity)}
              onChange={() => handleToggle(amenity)}
              className="hidden"
            />
            {amenity}
          </label>
        ))}
      </div>
    );
  }
  