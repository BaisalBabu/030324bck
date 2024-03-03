const express = require('express');
const router = express.Router();
const Booking = require("../model/booking");
const Room = require("../model/room");

router.post("/bookroom", async (req, res) => {
    const { room, userid, fromdate, todate, totalamount, totaldays, guestCount, username } = req.body;

    try {
        const newbooking = new Booking({
            room: room.name,
            roomid: room._id,
            username,
            userid,
            fromdate,
            todate,
            totalamount,
            totaldays,
            guestCount
        });

        const booking = await newbooking.save();
        const roomtemp = await Room.findOne({ _id: room._id });
        roomtemp.currentbookings.push({
            bookingid: booking._id,
            fromdate,
            todate,
            userid,
            status: booking.status
        });
        await roomtemp.save();

        res.status(200).send("Room Booked Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



router.post("/getbookingsbyuserid", async (req, res) => {
    console.log("Request received for getbookingsbyuserid");
    const userid = req.body.userid;

    try {
        const bookings = await Booking.find({ userid: userid });
        console.log("Bookings:", bookings);
        res.send(bookings);
    } catch (error) {
        console.log("Error fetching bookings:", error);
        res.status(500).json({ error: "Internal server error" });
    }
},[]);





router.post("/cancelbooking", async (req, res) => {
    const { bookingid, roomid } = req.body;

    try {
        const bookingItem = await Booking.findOne({ _id: bookingid });

        // Check if the booking status is not already "Cancelled"
        if (bookingItem.status !== "Cancelled") {
            bookingItem.status = "Cancelled";
            await bookingItem.save();

            const room = await Room.findOne({ _id: roomid });

            const bookings = room.currentbookings;

            const updatedBookings = bookings.filter(
                (booking) => booking.bookingid.toString() !== bookingid
            );

            room.currentbookings = updatedBookings;

            await room.save();

            // Increment the count for the canceled room
            // const updatedRoom = await Room.findByIdAndUpdate(
            //     roomid,
            //     { $inc: { count: 1 } },
            //     { new: true }
            // );

            if (!updatedRoom) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found",
                });
            }

            res.send("Your Booking Cancelled Successfully, and room count updated.");
        } else {
            res.status(400).json({
                error: "Booking is already cancelled.",
            });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/getallbookings",async(req,res)=>
    {
        try {
            const bookings= await Booking.find()
            res.send(bookings)
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    })



module.exports = router;
