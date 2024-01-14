// roomsRouter.js
const express = require('express');
const router = express.Router();
const RoomType = require('../model/type');

// Your existing routes...

// Example route to add a room type
router.post('/addroomtype', async (req, res) => {
    try {
      const newRoomType = new RoomType(req.body);
      await newRoomType.save();
      res.status(201).json({ message: 'New Room Type Added Successfully' });
    } catch (error) {
      if (error.code === 11000 && error.keyValue && error.keyValue.type) {
        console.error(`Duplicate room type: ${error.keyValue.type}`);
        res.status(400).json({ message: 'Duplicate room type' });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  });
// Other routes...

router.get('/getroomtypes', async (req, res) => {
    try {
      const roomTypes = await RoomType.find();
      res.json(roomTypes);
    } catch (error) {
      console.error('Error fetching room types:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  router.get('/getroomtype/:typeId', async (req, res) => {
    try {
      const roomType = await RoomType.findById(req.params.typeId);
      res.json(roomType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // Update room type by ID
  router.put('/updateroomtype/:typeId', async (req, res) => {
    try {
      const { type } = req.body;
  
      // Validate if the type exists
      if (!type) {
        return res.status(400).json({ message: 'Type is required' });
      }
  
      const updatedRoomType = await RoomType.findByIdAndUpdate(
        req.params.typeId,
        { type },
        { new: true }
      );
  
      res.json(updatedRoomType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  router.put('/handleactivate/:typeId', async (req, res) => {
    const { display } = req.body;
  
    try {
      const updatedType = await RoomType.findByIdAndUpdate(
        req.params.typeId,
        { $set: { display } },
        { new: true }
      );
  
      res.json(updatedType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Deactivate room type
  router.put('/handledeactivate/:typeId', async (req, res) => {
    const { display } = req.body;
  
    try {
      const updatedType = await RoomType.findByIdAndUpdate(
        req.params.typeId,
        { $set: { display } },
        { new: true }
      );
  
      res.json(updatedType);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
module.exports = router;
