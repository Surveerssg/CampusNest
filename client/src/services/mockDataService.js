import pgData from './pg_flat_data_nsut.json';

// Mock properties data
const mockProperties = pgData;

// Mock bookings/inquiries data
const mockBookings = [
  {
    id: 1,
    userId: 3,
    propertyId: 1,
    checkIn: "2024-03-20",
    checkOut: "2024-04-20",
    totalPrice: 8000,
    status: "pending",
    createdAt: "2024-03-01",
    type: "inquiry"
  }
];

// Authentication functions
export const authenticateUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

export const getUserById = (id) => {
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Property functions
export const filterProperties = (filters) => {
  let filtered = [...mockProperties];
  
  if (filters.type) {
    filtered = filtered.filter(property => property.type === filters.type);
  }
  
  if (filters.minPrice) {
    filtered = filtered.filter(property => property.price >= filters.minPrice);
  }
  
  if (filters.maxPrice) {
    filtered = filtered.filter(property => property.price <= filters.maxPrice);
  }
  
  if (filters.minRating) {
    filtered = filtered.filter(property => property.rating >= filters.minRating);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(property =>
      (property.title && property.title.toLowerCase().includes(searchLower)) ||
      (property.location && property.location.toLowerCase().includes(searchLower))
    );
  }
  
  if (filters.occupancy) {
    filtered = filtered.filter(property => property.occupancy === filters.occupancy);
  }
  
  if (filters.roomType) {
    filtered = filtered.filter(property => property.roomType === filters.roomType);
  }
  
  if (filters.leaseTerm) {
    filtered = filtered.filter(property => property.leaseTerm === filters.leaseTerm);
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(property => 
      filters.amenities.every(amenity => property.amenities.includes(amenity))
    );
  }
  
  return filtered;
};

export const getPropertyById = (id) => {
  return mockProperties.find(property => property.id === id);
};

export const getAllProperties = () => mockProperties;

// Booking/Inquiry functions
export const createBooking = (bookingData) => {
  const newBooking = {
    id: mockBookings.length + 1,
    ...bookingData,
    status: "pending",
    createdAt: new Date().toISOString().split('T')[0]
  };
  mockBookings.push(newBooking);
  return newBooking;
};

export const getUserBookings = (userId) => {
  return mockBookings.filter(booking => booking.userId === userId);
};

export const getBookingById = (id) => {
  return mockBookings.find(booking => booking.id === id);
};

export const updateBookingStatus = (bookingId, newStatus) => {
  const index = mockBookings.findIndex(booking => booking.id === bookingId);
  if (index !== -1) {
    mockBookings[index].status = newStatus;
    return mockBookings[index];
  }
  return null;
};

// Landlord functions
export const addProperty = (propertyData) => {
  const newProperty = {
    id: mockProperties.length + 1,
    ...propertyData,
    createdAt: new Date().toISOString().split('T')[0]
  };
  mockProperties.push(newProperty);
  return newProperty;
};

export const updateProperty = (id, propertyData) => {
  const index = mockProperties.findIndex(property => property.id === id);
  if (index !== -1) {
    mockProperties[index] = { ...mockProperties[index], ...propertyData };
    return mockProperties[index];
  }
  return null;
};

export const deleteProperty = (id) => {
  const index = mockProperties.findIndex(property => property.id === id);
  if (index !== -1) {
    const deletedProperty = mockProperties[index];
    mockProperties.splice(index, 1);
    return deletedProperty;
  }
  return null;
};

export const getLandlordProperties = (landlordId) => {
  return mockProperties.filter(property => property.ownerId === landlordId);
};

// Admin functions
export const getAllUsers = () => mockUsers;
export const getAllBookings = () => mockBookings;
export const approveProperty = (propertyId) => {
  const property = mockProperties.find(p => p.id === propertyId);
  if (property) property.status = 'approved';
  return property;
};
export const rejectProperty = (propertyId) => {
  const property = mockProperties.find(p => p.id === propertyId);
  if (property) property.status = 'rejected';
  return property;
};
export const suspendUser = (userId) => {
  const user = mockUsers.find(u => u.id === userId);
  if (user) user.suspended = true;
  return user;
}; 