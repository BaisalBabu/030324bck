const express = require("express");
const multer=require("multer")
const router = express.Router();
const Room = require('../model/room');
const storage = multer.memoryStorage(); // Store files as buffers in memory
const upload = multer({ storage: storage });

// Route to get all rooms
router.get("/getallrooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    
    // Modify each room object to include base64 encoded image data
    const roomsWithImages = rooms.map(room => ({
      _id: room._id,
      name: room.name,
      rentperday: room.rentperday,
      maxcount: room.maxcount,
      description: room.description,
      conditioning: room.conditioning,
      type: room.type,
      count: room.count,
      display:room.display,
      currentbookings:room.currentbookings,
      // Convert binary image data to base64
      imagefile1: room.imagefile1 ? {
        data: room.imagefile1.data.toString('base64'),
        contentType: room.imagefile1.contentType
      } : null,
      imagefile2: room.imagefile2 ? {
        data: room.imagefile2.data.toString('base64'),
        contentType: room.imagefile2.contentType
      } : null,
      imagefile3: room.imagefile3 ? {
        data: room.imagefile3.data.toString('base64'),
        contentType: room.imagefile3.contentType
      } : null,
    }));

    res.send(roomsWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


// Route to get room by ID
router.post("/getroombyid", async (req, res) => {
  const { roomids } = req.body;
  try {
      const foundRooms = await Room.find({ _id: { $in: roomids } });

      // Modify each room object to include base64 encoded image data
      const roomsWithImages = foundRooms.map(room => ({
          _id: room._id,
          name: room.name,
          rentperday: room.rentperday,
          maxcount: room.maxcount,
          description: room.description,
          conditioning: room.conditioning,
          type: room.type,
          count: room.count,
          display:room.display,
          currentbookings:room.currentbookings,
          // Convert binary image data to base64
          imagefile1: room.imagefile1 ? {
              data: room.imagefile1.data.toString('base64'),
              contentType: room.imagefile1.contentType
          } : null,
          imagefile2: room.imagefile2 ? {
              data: room.imagefile2.data.toString('base64'),
              contentType: room.imagefile2.contentType
          } : null,
          imagefile3: room.imagefile3 ? {
              data: room.imagefile3.data.toString('base64'),
              contentType: room.imagefile3.contentType
          } : null,
      }));

      res.send(roomsWithImages);
  } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
  }
});

// Route to add a new room
// Update your backend route configuration
router.post('/addroom', upload.fields([
  { name: 'imagefile1', maxCount: 1 },
  { name: 'imagefile2', maxCount: 1 },
  { name: 'imagefile3', maxCount: 1 },
]), async (req, res) => {
  try {
    // Log the received data
    console.log('Received Headers:', req.headers);
    console.log('Received Body:', req.body);
    console.log('Received Files:', req.files);

    // Your route logic
    const { name, rentperday, maxcount, description, conditioning, type, count } = req.body;
    const imageFiles = req.files;

    const newRoom = new Room({
      name,
      rentperday,
      maxcount,
      description,
      conditioning,
      type,
      count,
      imagefile1: {
        data: imageFiles['imagefile1'][0].buffer,
        contentType: imageFiles['imagefile1'][0].mimetype,
      },
      imagefile2: {
        data: imageFiles['imagefile2'][0].buffer,
        contentType: imageFiles['imagefile2'][0].mimetype,
      },
      imagefile3: {
        data: imageFiles['imagefile3'][0].buffer,
        contentType: imageFiles['imagefile3'][0].mimetype,
      },
    });

    const savedRoom = await newRoom.save();
    res.json(savedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Route to update room details
router.put('/updateroom/:id', upload.fields([
  { name: 'imagefile1', maxCount: 1 },
  { name: 'imagefile2', maxCount: 1 },
  { name: 'imagefile3', maxCount: 1 },
]), async (req, res) => {
  const roomId = req.params.id;
  const updatedRoomDetails = req.body;
  const imageFiles = req.files;

  try {
    // Check if any files are uploaded
    if (imageFiles && Object.keys(imageFiles).length > 0) {
      updatedRoomDetails.imagefile1 = {
        data: imageFiles['imagefile1'][0].buffer,
        contentType: imageFiles['imagefile1'][0].mimetype,
      };
      updatedRoomDetails.imagefile2 = {
        data: imageFiles['imagefile2'][0].buffer,
        contentType: imageFiles['imagefile2'][0].mimetype,
      };
      updatedRoomDetails.imagefile3 = {
        data: imageFiles['imagefile3'][0].buffer,
        contentType: imageFiles['imagefile3'][0].mimetype,
      };
    }

    // Perform the update only if files are uploaded
    if (Object.keys(updatedRoomDetails).length > 0) {
      await Room.updateOne({ _id: roomId }, { $set: updatedRoomDetails });
      res.send('Room updated successfully');
    } else {
      res.send('No files uploaded. Room details remain unchanged.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to delete a room by ID
// Route to delete a room by ID
router.delete("/deleteroom/:id", async (req, res) => {
  const roomId = req.params.id;
  try {
    const deletedRoom = await Room.findOneAndDelete({ _id: roomId });
    if (deletedRoom) {
      res.send("Room deleted successfully");
    } else {
      res.status(404).send("Room not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// Activation route
router.put('/handleactivate/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;

    // Find the room by ID
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Update the 'display' field to true (activate)
    room.display = true;

    // Save the updated room
    await room.save();

    return res.status(200).json({ message: 'Room activated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Deactivation route
router.put('/handledeactivate/:roomId', async (req, res) => {
  try {
    const roomId = req.params.roomId;

    // Find the room by ID
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Update the 'display' field to false (deactivate)
    room.display = false;

    // Save the updated room
    await room.save();

    return res.status(200).json({ message: 'Room deactivated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
