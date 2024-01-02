require("dotenv").config({});
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 4000;
const SendEmail = require("./utils/SendEmail");


// routes here
const OtpRoute = require("./router/OtpRoute");




// midllware calling here
app.use(express.json());
app.use(cors("*"));
app.use(bodyParser.json());
app.use(morgan("dev"));




app.use(OtpRoute)

app.get(`/`, async (req, res) => {
    res.status(200).send("Poolyfi App")
})

app.use("*", (req, res, next) => {
    res.status(400).send("Page Not Found!");
    next()
})


// database start here

mongoose.connect(process.env.MONGO).then(() => {
    console.log(`Database Connected`)
}).catch(err => console.log(err))





// server listing
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

