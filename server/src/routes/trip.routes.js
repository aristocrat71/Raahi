const router = require('express').Router();
const tripController = require('../controllers/trip.controller');
const { authenticateJWT } = require('../middleware/auth');

// Trip routes - all require JWT authentication
router.use(authenticateJWT);

// Get all trips for the current user
router.get('/', tripController.getUserTrips);

// Get a specific trip by ID
router.get('/:id', tripController.getTripById);

// Create a new trip
router.post('/', tripController.createTrip);

// Update an existing trip
router.put('/:id', tripController.updateTrip);

// Delete a trip
router.delete('/:id', tripController.deleteTrip);

// Add an item to a trip
router.post('/:id/items', tripController.addTripItem);

// Update a trip item
router.put('/:tripId/items/:itemId', tripController.updateTripItem);

// Delete a trip item
router.delete('/:tripId/items/:itemId', tripController.deleteTripItem);

// Get all items for a trip
router.get('/:id/items', tripController.getTripItems);

// Get public trips
router.get('/discover/public', tripController.getPublicTrips);

// Search trips
router.get('/search/:query', tripController.searchTrips);

module.exports = router;
