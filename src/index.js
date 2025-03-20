const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");

// Routes
const authRoutes = require("./routes/auth");
const otpRoutes = require('./routes/otpRoutes');
dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use('/auth',authRoutes);
app.use('/otp',otpRoutes);

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is running on port: ${process.env.PORT || 3000}`)
});