import express from "express";
import viewEngine from "./configs/viewEngine";
import bodyParser from "body-parser";
import initWebRoute from "./routes/web";
require("dotenv").config();


let app = express();

//config view engine 
viewEngine(app);

//parser request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//init webroutes
initWebRoute(app);


let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log("Chatbot dang chay: " + port);
})