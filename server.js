require("dotenv").config()
const express = require("express");
const app = express();
const mongoose = require("mongoose")
const cors = require("cors")
const userAuthRouter = require("./routes/userAuthRouter")
const eventRouter = require("./routes/eventRouter")


app.use(express.json());
const allowedOrigins = [
  'https://mb-event-wheat.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


//test route
app.get("/", (req,res)=>{
    res.status(200).json({success : true, message: "MB events server"})
});
app.use("/api/user", userAuthRouter)
app.use("/api/user/events",eventRouter)

const startserver = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
        app.listen(process.env.PORT, ()=>{
            console.log(`Server running on port: ${process.env.PORT}`);
        })


    } catch (error) {
        console.log(error)

    }
}
startserver()
//error route
app.use((req,res)=>{
    res.status(401).json({success: false , message : "ROUTE NOT FOUND"})
})