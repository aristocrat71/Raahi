const Trip = require('../models/Trip');
const TripItem = require('../models/TripItem');

// Get all trips for current user
const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.getAllByUser(req.user.id);
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching user trips:', error);
    res.status(500).json({ error: 'Server error fetching trips' });
  }
};

// Get a specific trip by ID
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.getById(req.params.id, req.user.id);
    
    // Check if trip belongs to user
    if (!trip || trip.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Trip not found or access denied' });
    }
    
    res.status(200).json({
      success: true,
      trip
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({ error: 'Server error fetching trip' });
  }
};

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const { source, destination, startDate, endDate, numPeople, transport } = req.body;
    
    // Validation
    if (!source || !destination || !startDate || !endDate || !transport) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newTrip = await Trip.create({
      user_id: req.user.id,
      source,
      destination,
      start_date: startDate,
      end_date: endDate,
      num_people: numPeople || 1,
      transport
    });
    
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: newTrip
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Server error creating trip' });
  }
};

// Update an existing trip
const updateTrip = async (req, res) => {
  try {
    const { source, destination, startDate, endDate, numPeople, transport } = req.body;
    
    // Prepare update data
    const updateData = {};
    if (source !== undefined) updateData.source = source;
    if (destination !== undefined) updateData.destination = destination;
    if (startDate !== undefined) updateData.start_date = startDate;
    if (endDate !== undefined) updateData.end_date = endDate;
    if (numPeople !== undefined) updateData.num_people = numPeople;
    if (transport !== undefined) updateData.transport = transport;
    
    const updatedTrip = await Trip.update(req.params.id, req.user.id, updateData);
    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Server error updating trip' });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    await Trip.delete(req.params.id, req.user.id);
    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Server error deleting trip' });
  }
};

// Add an item to a trip
const addTripItem = async (req, res) => {
  try {
    const { type, title, description, location, startTime, endTime, cost, currency, reservationCode, imageUrl } = req.body;
    
    // Validation
    if (!type || !title || !['activity', 'accommodation', 'transportation', 'note'].includes(type)) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }
    
    // Verify trip ownership
    const trip = await Trip.getById(req.params.id, req.user.id);
    if (!trip || trip.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Trip not found or access denied' });
    }
    
    const newItem = await TripItem.create({
      trip_id: req.params.id,
      type,
      title,
      description,
      location,
      start_time: startTime,
      end_time: endTime,
      cost,
      currency,
      reservation_code: reservationCode,
      image_url: imageUrl
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding trip item:', error);
    res.status(500).json({ error: 'Server error adding trip item' });
  }
};

// Update a trip item
const updateTripItem = async (req, res) => {
  try {
    const { title, description, location, startTime, endTime, cost, currency, reservationCode, imageUrl } = req.body;
    
    // Verify trip ownership
    const trip = await Trip.getById(req.params.tripId, req.user.id);
    if (!trip || trip.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Trip not found or access denied' });
    }
    
    // Prepare update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (location !== undefined) updateData.location = location;
    if (startTime !== undefined) updateData.start_time = startTime;
    if (endTime !== undefined) updateData.end_time = endTime;
    if (cost !== undefined) updateData.cost = cost;
    if (currency !== undefined) updateData.currency = currency;
    if (reservationCode !== undefined) updateData.reservation_code = reservationCode;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    
    // Add updated_at timestamp
    updateData.updated_at = new Date();
    
    const updatedItem = await TripItem.update(req.params.itemId, req.params.tripId, updateData);
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('Error updating trip item:', error);
    res.status(500).json({ error: 'Server error updating trip item' });
  }
};

// Delete a trip item
const deleteTripItem = async (req, res) => {
  try {
    // Verify trip ownership
    const trip = await Trip.getById(req.params.tripId, req.user.id);
    if (!trip || trip.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Trip not found or access denied' });
    }
    
    await TripItem.delete(req.params.itemId, req.params.tripId);
    res.status(200).json({ success: true, message: 'Trip item deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip item:', error);
    res.status(500).json({ error: 'Server error deleting trip item' });
  }
};

// Get all items for a trip
const getTripItems = async (req, res) => {
  try {
    // Verify access to trip
    const trip = await Trip.getById(req.params.id, req.user.id);
    if (!trip || (trip.user_id !== req.user.id && !trip.is_public)) {
      return res.status(403).json({ error: 'Trip not found or access denied' });
    }
    
    const items = await TripItem.getAllByTrip(req.params.id);
    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching trip items:', error);
    res.status(500).json({ error: 'Server error fetching trip items' });
  }
};

// Get public trips for discovery
const getPublicTrips = async (req, res) => {
  return res.status(404).json({
    error: true,
    message: 'Public trips functionality has been removed'
  });
};

// Search trips
const searchTrips = async (req, res) => {
  try {
    const query = req.params.query;
    const results = await Trip.search(query, req.user.id);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching trips:', error);
    res.status(500).json({ error: 'Server error searching trips' });
  }
};

module.exports = {
  getUserTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  addTripItem,
  updateTripItem,
  deleteTripItem,
  getTripItems,
  getPublicTrips,
  searchTrips
};
