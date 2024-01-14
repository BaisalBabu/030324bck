
const express=require("express")
const app=express();
const cors = require('cors');



const studmodel=require('./db')
const roomRouter=require('./routes/roomsRouter')
const usersRouter=require('./routes/usersRouter')
const AdminRouter=require('./routes/adminRouter')
const bookingsRouter=require('./routes/bookingsRouter')
const typeRouter=require('./routes/typeRouter')

app.use(cors());
app.use(express.json())

app.use('/api/types',typeRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/users', usersRouter)
app.use('/api/admin', AdminRouter )
app.use('/api/bookings',bookingsRouter )

app.listen(3005,()=>

    console.log("connected")
)