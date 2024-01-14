const mongoose=require("mongoose")
var mongoUrl="mongodb+srv://gauthamsajus686:2003@cluster0.btg6bil.mongodb.net/Hotel"
mongoose.connect(mongoUrl)
.then(()=>{
    console.log("Database Connected")

})

.catch(err =>
    {
        console.log(err)
    })

    module.exports=mongoose