const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+ "/index.html");
});

app.post("/", function(req, res){
    console.log(req.body.cityName);
    console.log("Post request received"); 
    var query = req.body.cityName;
    const unit = "metric";
    const apiKey = "ee598263fd5e984ddd253134d3d9c214";

    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&units="+ unit +"&appid="+ apiKey;

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const weatherIcon = weatherData.weather[0].icon
            const imageURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"

            res.setHeader("Content-Type", "text/html");
            res.write("<body style='text-align: center; margin: 5%; background-color: lightgreen; color: maroon;'>")
            res.write("<h3>The weather right now is " + weatherDescription + ".</h3>");
            res.write("<h1>The temperature in "+ query +" is "+ temp +" degrees Celsius.</h1>");
            res.write("<img src="+imageURL+">");
            res.send();
        });
    });
})

app.listen(3000, function(req, res){
    console.log("Server running on port 3000!");
});