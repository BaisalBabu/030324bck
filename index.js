const express = require("express");
const cors = require('cors');

const app = express();

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const studmodel = require('./db');
const roomRouter = require('./routes/roomsRouter');
const usersRouter = require('./routes/usersRouter');
const AdminRouter = require('./routes/adminRouter');
const bookingsRouter = require('./routes/bookingsRouter');
const typeRouter = require('./routes/typeRouter');

app.use('/api/types', typeRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/bookings', bookingsRouter);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
